import UserView from './UserView';
import type {
  GetUserNotificationSettingsResponse,
  GetUsersResponse,
} from '@/lib/api-types';

const UserPageContent = ({
  user,
  userId,
  notificationSettings,
}: {
  user: GetUsersResponse;
  userId: string;
  notificationSettings: GetUserNotificationSettingsResponse;
}) => (
  <UserView
    user={user}
    userId={userId}
    notificationSettings={notificationSettings}
  />
);

export default UserPageContent;
