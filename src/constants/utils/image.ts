import piexif from 'piexifjs'
import heic2any from 'heic2any'

const resizeImage = (file: File, targetDPI: number = 300): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const finalMimeString = 'image/jpeg'
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        let imageSrc = e.target?.result as string

        if (file.type === 'image/svg+xml') {
          const svgContent = imageSrc
          const parser = new DOMParser()
          const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
          const svgElement = svgDoc.documentElement

          const metadata = svgDoc.createElementNS(
            'http://www.w3.org/2000/svg',
            'metadata'
          )
          metadata.textContent =
            'SMTrack+ Copyright - Thanes Development Co., Ltd.'
          svgElement.insertBefore(metadata, svgElement.firstChild)

          const serializer = new XMLSerializer()
          const updatedSvg = serializer.serializeToString(svgDoc)

          const svgBlob = new Blob([updatedSvg], { type: 'image/svg+xml' })
          const resizedFile = new File([svgBlob], file.name, {
            type: 'image/svg+xml'
          })
          resolve(resizedFile)
          return
        }

        if (file.type === 'image/heic' || file.type === 'image/heif') {
          const heicBlob = await heic2any({ blob: file, toType: 'image/jpeg' })
          const singleBlob = Array.isArray(heicBlob) ? heicBlob[0] : heicBlob
          imageSrc = URL.createObjectURL(singleBlob)
        }

        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
          const canvas = document.createElement('canvas')
          const context: CanvasRenderingContext2D | null =
            canvas.getContext('2d')
          const maxDimensions = { width: 128, height: 128 }
          const scaleFactor = Math.min(
            maxDimensions.width / image.width,
            maxDimensions.height / image.height
          )
          const originalWidth = image.width * scaleFactor
          const originalHeight = image.height * scaleFactor
          const dpiScale = targetDPI / 96
          canvas.width = originalWidth * dpiScale
          canvas.height = originalHeight * dpiScale
          canvas.style.width = `${originalWidth}px`
          canvas.style.height = `${originalHeight}px`
          context?.scale(dpiScale, dpiScale)
          context?.drawImage(image, 0, 0, originalWidth, originalHeight)

          if (context) {
            context.font = '6px Anuphan'
            context.fillStyle = 'rgba(255, 255, 255, 0.18)'
            context.textAlign = 'right'

            context.shadowColor = 'rgba(0, 0, 0, 0.5)'
            context.shadowOffsetX = 2
            context.shadowOffsetY = 2
            context.shadowBlur = 1

            context.fillText('SMTrack+', originalWidth - 5, originalHeight - 5)

            context.shadowColor = 'transparent'
            context.shadowOffsetX = 0
            context.shadowOffsetY = 0
            context.shadowBlur = 0
          }

          const dataUrl = canvas.toDataURL(finalMimeString)

          const exifObj = piexif.load(dataUrl)
          exifObj['0th'] = exifObj['0th'] || {}
          exifObj['0th'][piexif.ImageIFD.Copyright] =
            'SMTrack+ Copyright - Thanes Development Co., Ltd.'
          const exifStr = piexif.dump(exifObj)
          const newImageData = piexif.insert(exifStr, dataUrl)

          const byteString = atob(newImageData.split(',')[1])
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], { type: finalMimeString })
          const resizedFile = new File([blob], file.name, {
            type: finalMimeString
          })
          resolve(resizedFile)
        }
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = error => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

const isSafeImageUrl = (url: string) =>
  url?.startsWith('blob:') || url?.startsWith('https://')

export { resizeImage, isSafeImageUrl }
