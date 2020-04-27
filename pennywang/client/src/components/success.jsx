import React, { Component } from 'react';


class Success extends Component{
    login = ()=>{
        this.props.history.push('/login')
    }
    render(){
        return(
            <div className='container'>
            <h2 style={{textAlign: 'center'}}>Successfully Created</h2>
        <button className='btn-success' style={{marginLeft: '45%'}} onClick={this.login} >Get Started</button>
            </div>
        )
    }
};
export default Success;