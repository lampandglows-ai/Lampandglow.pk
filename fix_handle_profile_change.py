path = r'D:\web development\Lampandglow.pk\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add updateProfile to useAuth destructuring
old_auth = '  const { user, isLoggedIn, logout } = useAuth()'
new_auth = '  const { user, isLoggedIn, logout, updateProfile } = useAuth()'
content = content.replace(old_auth, new_auth)

# 2. Create handleProfileChange function after handleLogout
old_logout = '''  function handleLogout() {
    logout()
    navigate('/')
  }'''
new_logout = '''  function handleLogout() {
    logout()
    navigate('/')
  }

  const handleProfileChange = async (key, value) => {
    try {
      await updateProfile({ [key]: value })
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }'''
content = content.replace(old_logout, new_logout)

# 3. Replace empty handleProfileChange props with the real function
content = content.replace('handleProfileChange={() => {}}', 'handleProfileChange={handleProfileChange}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('handleProfileChange fixed')
