const fs = require('fs');
const $ = require('inquirer');
const { rawListeners } = require('process');
const path = "./users.json"

const prompt = (object) => {
    return $.prompt((object));
}

// read the file and return file content
// getContentFile will return data in JSON format
function getContetFile(){
    // console.log('getContentFile scope \n reading file...')
    return fs.readFileSync(path, 'utf8');

}

// write file with content as parameter
function writeFile(path, data){
    fs.writeFileSync(path, data, 'utf8', (err) => {
        if (err) { throw new err; }
        console.error('Error: ',err);
    });
    console.log('output file modified with successful!!');
}

// create a file to store users
function createFile(){
    let obj = {
        users: []
    };

    try {
        writeFile('users.json', JSON.stringify(obj));
    } catch (err) {
        console.log(err);
    }
}

async function login(){
    console.log('Enter your login and password:...');
    let state = 0;
    
    let userLogin = "";
    try {  
        let userList = JSON.parse(getContetFile());
       await prompt([
            {
                type: 'input',
                name: 'login',
                message: 'Login: '
            },
            {
                type: 'password',
                name: 'password',
                mask: '',
                message: 'Password: '
            }]).then((answers) => {
                let user = userList.users;
                
            
                    for(let i=0; i < user.length; i++) {
                        if(user[i].login == answers.login){
                            if(user[i].password == answers.password){
                                console.clear();
                                console.log('...');
                                state = 2;
                                userLogin = user[i].login;
                                break;
                            }else{
                                state = 1;
                                console.clear();
                                // console.log('The password was incorrect');
                                // login();
                            }
                        }
                    }
                    
                    
            
                
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        if (state == 2) {
           console.log('You are logged in the system!!');
           onLogin(userLogin);
        }else if (state == 1) {
            console.log('password was incorrect!!');
            login();
        }else{
            start();
            console.log('Login or password are invalid!!\nPlease verify login and password!!');
        }
        
    }
}

function onLogin(login){
    this.user = login ? login : "";
    console.log('Welcome: '+user);
    prompt([{
        type: 'rawlist',
        name: 'action',
        message: 'What you want to do?? ',
        choices: ['Logout','Exit']
    }]).then((answers) => { 
        let opt = answers.action = answers.action || globalThis.addEventListener();

        if(answers.action == 'Logout'){
            console.clear();
            console.log("bye bye!");
            start();
        }else{
            console.clear();
            console.log("See ya!!");
            process.exit(0);
        }
    })
}

// add a new user to file
function addUser(user){
    let data = JSON.parse(getContetFile()); //JSON.parse will parse JSON to OBJ 
    console.log('reading users from output.json');
    data.users.push(user);
    writeFile(path, JSON.stringify(data)); //JSON.stringify will parse OBJ to JSON format
    console.log('New user added with successful!!');
}

async function registerUser(){
    
    try {
        await $.prompt([
            {
                type: 'input',
                name: 'login',
                message: 'Enter new user login: '
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter new password: '

            }
        ]).then((user) => { 
            addUser(user);
        })

    } catch (error) {
        
    }finally {
        start();
    }
    
        
}


// array to use in prompt
let initMsg = [
    {
        type: 'rawlist',
        name: 'action',
        message: 'Welcome to login MgMt 1.0\n  Choose one option:',
        choices: [ 'Login', 'Register User', 'Exit']
    }
];

async function start(){
    console.clear;

    if (fs.existsSync('./users.json')) {

    }else{
        console.log("Creating file...");
        createFile();
    }


    let opt = initMsg[0];
    

    
        await $.prompt((initMsg)).then((answers) => {
            if(answers.action == opt.choices[0]){
                console.clear();
                login();
                // console.log("login with user and password")
            }else if(answers.action == opt.choices[1]){
                console.clear();
                registerUser();
                // console.log("register new users");
            }else if(answers.action == opt.choices[2]){
                console.log("See ya!");
                process.exit();
            }
            
        })
    
    
}

start();