import React, { Component } from 'react';
import swal from 'sweetalert'
import axios  from 'axios'

class Signup extends Component {
    componentDidMount() {
        window.scrollTo(0, 0)
      }
    logIn = () => {
        this.props.history.push('/login')
    }
    signUp = () => {
        
        document.getElementById('register-btn').setAttribute('disabled', 'disabled')

        let signUpForm = document.getElementById('signUpForm')
        let formData = new FormData(signUpForm);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post('/createAccount', formData, config, {

            body: formData
        })
            .then(function (response) {
                
                if (response.data.status === 400 && response.data.success === false) {
                    document.getElementById('register-btn').removeAttribute('disabled')
                    swal({
                        title: "Oh Snap!",
                        text: "Something went wrong!",
                        icon: "error",
                        button: "Try Again!",
                    })
                }
              
                if (response.data.status === 200 && response.data.success === true) {
                    document.getElementById('register-btn').removeAttribute('disabled')
        
                    swal({
                        title: "Hurraahh!",
                        text: "Your account has been created successfully!",
                        icon: "success",
                        button: "Ok!",
                    })
                    document.getElementById("signUpForm"). reset();
                }
                })
            .catch(function (error) {
                
                document.getElementById('register-btn').removeAttribute('disabled')
                    swal({
                        title: "Oh Snap!",
                        text: "Something went wrong!",
                        icon: "error",
                        button: "Try Again!",
                    })
            
            });
    }
    chkUsername = () => {

        axios.post('/chkUsername', {
            params: {
                username: document.getElementById('username').value
            }
        })
            .then(function (response) {
                if (response.data === "") {
                    document.getElementById('username-span').style.display = 'none'
                    document.getElementById('register-btn').removeAttribute('disabled')

                }
                if (response.data !== "") {
                    document.getElementById('username-span').style.display = 'block'
                    document.getElementById('register-btn').setAttribute('disabled', 'disabled')

                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    render() {
        return (
            <div className='container'>
                <nav className="navbar fixed-top bg-dark navbar-light ">
                    <h2 className="text-white" >Hearthstone Cards</h2>
                </nav>
                <form className="form-signin" id='signUpForm' name='signUpForm'>
                    <br />
                   
                    <img className="mx-auto d-block" src="http://abdulromli.it.student.pens.ac.id/Maluku/img/ph.png" alt="" width="80" height="80" />
                    <h2 style={{ textAlign: 'center' }}>Sign up </h2>
                    <input type="name" id="username" className="form-control" onChange={this.chkUsername} placeholder="username" name='username' required />
                    <span id='username-span' style={{ color: 'red', display: 'none',marginTop: '12px' }} className="help-block">username is already in use.</span>
                    <input type="password"  className="form-control" placeholder="password" name='password' required style={{marginTop: '12px'}} />
                    <input type="password"  className="form-control" placeholder="re-enter password" required />
                    <label>Upload your picture</label>
                    <input type='file' name='ProfilePic' required />
                    <br /><br />
                    <button className="btn btn-lg btn-success btn-block" id='register-btn' type="button" onClick={this.signUp}>Create Account</button>
                    <button className="btn btn-lg btn-info btn-block" onClick={this.logIn} type="button">Back to log in page</button>
                </form>
            </div>
        );
    }
}

export default Signup;