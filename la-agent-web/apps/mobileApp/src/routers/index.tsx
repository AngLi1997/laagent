import Login from '@/pages/Login/index.tsx';
import Chat from '@/pages/Chat/index.tsx';
import Set from '@/pages/Set'
import Feedback from '@/pages/Set/FeedbackScreen'
import Agent from '@/pages/Agent'
import ChangePassword from '@/pages/Set/ChangePassword'
import ChangeAvatar from '@/pages/Set/ChangeAvatar'
import DocumentList from '@/pages/DocumentList'
import SearchHistory from '@/pages/SearchHistory'

export const routerList = [
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'Chat',
    component: Chat,
  },
  {
    name: 'Set',
    component: Set,
  },
  {
    name: 'Feedback',
    component: Feedback
  },
  {
    name: 'Agent',
    component: Agent
  },
  {
    name: 'ChangePassword',
    component: ChangePassword
  },
  {
    name: 'ChangeAvatar',
    component: ChangeAvatar
  },
  {
    name: 'DocumentList',
    component: DocumentList
  },
  {
    name: 'SearchHistory',
    component: SearchHistory
  }
]