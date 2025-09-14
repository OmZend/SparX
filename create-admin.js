// One-time script to create an admin user
// Run this in the browser console when logged in as an admin

function createAdminUser() {
    const email = 'admin@sparx.com';
    const password = 'admin123';
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User created successfully
            console.log('Admin user created successfully:', userCredential.user.email);
            alert('Admin user created successfully: ' + userCredential.user.email);
        })
        .catch((error) => {
            // Handle errors
            console.error('Error creating admin user:', error);
            alert('Error creating admin user: ' + error.message);
        });
}

// Call the function
createAdminUser();