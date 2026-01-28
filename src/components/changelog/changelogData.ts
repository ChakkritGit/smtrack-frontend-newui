export interface ChangeLogItem {
  version: string
  date: string
  isNew?: boolean
  changes: string[]
  titleSuffixKey?: string
}

export const CHANGELOG_DATA: ChangeLogItem[] = [
  {
    version: 'v2.0.13',
    date: '2026-01-28',
    isNew: true,
    changes: ['v2_0_13.bugFixes']
  },
  {
    version: 'v2.0.7',
    date: '2026-01-06',
    changes: ['v2_0_7.bugFixes']
  },
  {
    version: 'v2.0.6',
    date: '2025-12-20',
    changes: ['v2_0_6.message']
  },
  {
    version: 'v2.0.5',
    date: '2025-11-25',
    changes: ['v2_0_5.message']
  },
  {
    version: 'v2.0.4',
    date: '2025-10-30',
    changes: ['v2_0_4.message']
  },
  {
    version: 'v2.0.3',
    date: '2025-10-05',
    changes: ['v2_0_3.message']
  },
  {
    version: 'v2.0.2',
    date: '2025-09-17',
    changes: ['v2_0_2.updateDeps', 'v2_0_2.fixFilterWard', 'v2_0_2.bugFixes']
  },
  {
    version: 'v2.0.1',
    date: '2025-08-14',
    changes: ['v2_0_1.updateDeps', 'v2_0_1.fixGraphGradient']
  },
  {
    version: 'v2.0.0',
    date: '2025-08-01',
    titleSuffixKey: 'v2.titleSuffix',
    changes: ['v2.rewrite']
  }
]
