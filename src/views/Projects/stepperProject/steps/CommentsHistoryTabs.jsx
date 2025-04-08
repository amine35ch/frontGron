import { Box, Button, Stack } from '@mui/material'
import CommentsHistorySingleTab from './CommentsHistorySingleTab'

export default function CommentsHistoryTabs({ tabs, activeTab, setActiveTab, children }) {
  return (
    <Stack spacing={2}>
      <Stack direction='row' spacing={2}>
        {tabs.map((tab, index) => (
          <CommentsHistorySingleTab
            key={index}
            label={tab.label}
            onClick={() => setActiveTab(tab.value)}
            isSelected={activeTab === tab.value}
          />
        ))}
      </Stack>

      {children}
    </Stack>
  )
}
