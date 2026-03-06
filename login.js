document.getElementById('sign-in').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Username:', username);
    console.log('Password:',password);
    if (username === 'admin' && password === 'admin123') {
       alert('Login successful!');
       window.location.replace('/home.html');
    } 
    // else {
    //     alert('Invalid credentials.');
    //     return
    // }
});