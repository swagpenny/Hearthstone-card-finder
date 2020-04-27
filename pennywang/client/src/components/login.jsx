import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';

class Login extends Component {
    componentDidMount() {
        window.scrollTo(0, 0)
      }
    authUser = () => {


        axios.post('/authUser',
        {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        )   
            .then((res) => {

                if(res.data.statusCode === 200 && res.data.success === true){
                    this.props.history.push('/dashboard')
                }
            })
            .catch((error) => swal({
                title: "Ooops!",
                text: "Invalid username or password!",
                icon: "error",
                button: "Try Again!",
              }))
    };
    signup = () => {
        this.props.history.push('/signup')
    };
    
    
    render() {
        return (
            <div >
                <nav className="navbar fixed-top bg-dark navbar-light ">
                    <h2 className="text-white nav-logo" >MVC Project</h2>
                </nav>
                <div id='bg-img'>
                    <br />
                    
                    <div className="form-signin">
                        <img className="mx-auto d-block" src="http://abdulromli.it.student.pens.ac.id/Maluku/img/ph.png" alt="" width="80" height="80" />
                        <h2 className="form-signin-heading" style={{ textAlign: 'center' }}>Log in</h2>
                        <input type="name" id="username" className="form-control" placeholder="Username" required="" autoFocus="" />
                        <input type="password" id="password" className="form-control" placeholder="Password" style={{marginTop: '12px'}} required="" />
                        <button className="btn btn-lg btn-primary btn-block" onClick={this.authUser}>Log in</button>
                        <h6 style={{ textAlign: 'center', marginTop: '10px' }}>OR</h6>
                        <button className="btn btn-lg btn-success btn-block" onClick={this.signup} type="submit">Sign up</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default Login;