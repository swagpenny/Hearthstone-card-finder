import React, { Component } from 'react';
import swal from 'sweetalert'
class updatePass extends Component {

    toggleShow = ()=>{
        
            var x = document.getElementById("password");
            if (x.type === "password") {
              x.type = "text";
            } else {
              x.type = "password";
            }
        
    };

    updatePass = ()=>{
        if(document.getElementById('password'.value === "")){
            swal({
                title: "Oooops",
                text: "Please enter a valid password",
                icon: "erroe",
                button: "Re-Enter",
              })
        }
        fetch('/changePass', {
            method: 'POST',
            body: JSON.stringify({
                newPass: document.getElementById('password').value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        .then((res)=> res.json())
        .then((data) =>{
            let success = data.response[0];

            if (success === 200){
                swal({
                    title: "Success",
                    text: "Password Changed!",
                    icon: "success",
                    button: "OK",
                  })
            }
        }
        
    )
    .catch((err) =>{
        console.log(err)
    })
    }

    dashboard = ()=>{
        this.props.history.push('/dashboard')
    }

    render() { 
        return ( 
                        <div className='container'>
                        <nav className="navbar fixed-top bg-dark navbar-light ">
                            <h2 className="text-white" >HearthStone Cards</h2>
                        </nav>
                        <div className="container">
                            <br />
                            <br />
                            <br />
                            <div className="form-signin">
                                <img className="mx-auto d-block" src="https://www.thepopefirm.com/wp-content/uploads/2019/02/nku-change-password.png" alt="" width="80" height="80" />
                                <h2 className="form-signin-heading" style={{ textAlign: 'center' }}>Change Password</h2>
                                <input type="password" id="password" className="form-control" placeholder="Password" required="" />
                                <input type="checkbox" onClick={this.toggleShow}/> Show Password
                                <button className="btn btn-lg btn-primary btn-block" onClick={this.updatePass}>Update Password</button>
                                <button className="btn btn-lg btn-success btn-block" onClick={this.dashboard} type="submit">Go Back</button>
                            </div>
        
                        </div>
                    </div>
         );
    }
}
 
export default updatePass;