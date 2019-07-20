import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import './App.css'
import config from './config'
import qs from 'qs'

class Login extends React.Component {

    state = {
        user :'',
        password :''
    }

    getCookie(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
    }


    login = (e) => {
        console.log('login')
        e.preventDefault()
        this.props.go(1)
        return

        const url = config.base_url + '/auth/login';
        const data = {
            user: this.state.user, 
            password: this.state.password
        }
        fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            // 对象转为 query string
            body: qs.stringify(data),
        }).then(response => {
            if (response.status == 200) {
                this.props.history.push('/')
            }
        }).catch(error => console.log(error));
    }

    onChangeUser= (e)=>{
        this.setState({user: e.target.value})
    }

    onChangePassword= (e)=>{
        this.setState({password:e.target.value})
    }

    render() {
        return (
            <div className="inner">
                <form method="POST">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">User:</label>
                        <div className="col-sm-10"><input name="user" className="form-control" type="text" onChange={this.onChangeUser} /><br /></div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Password:</label>
                        <div className="col-sm-10"><input name="password" className="form-control" type="password" onChange={this.onChangePassword} /><br /></div>
                    </div>
                    <button type="submit" className="btn btn-primary mb-2" onClick={this.login}>Login</button>
                </form>
            </div>
        )
    }
}

export default Login