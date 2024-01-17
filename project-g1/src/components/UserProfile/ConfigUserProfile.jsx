import React from 'react'
import ChangeName from './ChangeName'

function ConfigUserProfile({ userId, user, currentUser, setCurrentUser }) {
  return (
    <div>
      <p>Email: {user.email}</p>
      <ChangeName
        userId={userId}
        user={user}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  )
}

export default ConfigUserProfile