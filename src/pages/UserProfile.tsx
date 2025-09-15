import Account from './Account';

// Simple alias/forwarder so we can have a distinct route name `/profile` per the request
export default function UserProfile() {
  return <Account />;
}
