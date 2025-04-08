import { useState } from 'react'

import CommentsHistoryTabs from './CommentsHistoryTabs'
import CommentForm from './CommentForm'
import HistorySection from './HistorySection'
import { Stack } from '@mui/material'

export default function ModificationOrSuspendRequestCommentsSection({ projectId, isReversible = false, onCancel }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <CommentsHistoryTabs
      tabs={[
        { label: 'Commentaire', value: 0 },
        { label: 'Historique', value: 1 }
      ]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <Stack height='300px'>
        {activeTab === 0 ? (
          <CommentForm
            label='Merci de bien vouloir préciser la raison des modifications apportées à la demande:'
            projectId={projectId}
            isReversible={isReversible}
            onCancel={onCancel}
          />
        ) : (
          <HistorySection projectId={projectId} />
        )}
      </Stack>
    </CommentsHistoryTabs>
  )
}
