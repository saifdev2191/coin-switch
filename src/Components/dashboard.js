import React, { Component } from 'react';
import './layout.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AutorenewTwoToneIcon from '@material-ui/icons/AutorenewTwoTone';
import Switch from "@material-ui/core/Switch";
import axios from 'axios';
// import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import Tooltip from '@material-ui/core/Tooltip';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from './alert';
import {coinapi, rateapi} from '../Api/api'
// import MuiAlert from "@material-ui/lab/Alert";
// import Alert from '@material-ui/lab/Alert';
// import { makeStyles } from "@material-ui/core/styles";
// import { display } from '@material-ui/system';

class Dashboard extends React.PureComponent {

state = {
    checkedA: false,
    progress:0,
    checkBox: true,
    dataDropdown:[],
    sendCoin:1,
    currencySend:"btc",
    receiveCoin:"",
    currencyReceive: "usd",
    flag: false, 
    exchangeRate: "",
    toasterFlag: false,
    errorMsg:""
    // sendCoinSelected:"",
}

componentDidMount(){
    const payload = {
        depositCoin: this.state.currencySend,
        destinationCoin: this.state.currencyReceive
    }
   
    //using middleware to overcome CORS problem
    // axios.get('https://cors-anywhere.herokuapp.com/https://api.coinswitch.co/v2/coins', {
    //     'headers': {
    //         'x-api-key': 't41E6v16mG6xqOUK74E2F7Py6UVng4K6n1pO3Jig' ,
    //         'x-user-ip': '1.1.1.1'
    //         }
    //     })
    // axios.all([coinapi(),rateapi(payload)])
    // .then(axios.spread((...responses) => {
    //     const responseOne = responses[0]
    //     const responseTwo = responses[1]
    //     console.log(responses[0]);
    //     console.log(responses[1])
    //     this.setState({dataDropdown:responses[0].data.data,currencySend: "btc",flag: false, exchangeRate: responses[1].data.data.rate });

    //     // use/access the results 
    //   }))
    // .catch((e)=>{
    //     console.log(e)
    // })

    coinapi().then((res)=>{
        console.log(res.data.data);
        this.setState({dataDropdown:res.data.data,currencySend: "btc" })
    })
    .catch((e)=>console.log(e));

    rateapi(payload)
    .then((res)=>{
        console.log(res.data.data)
        const data = res.data;
        console.log(res)
        if(data.success){
            this.setState({flag: false, exchangeRate: data.data.rate})
            
        }
        else{
            this.setState({toasterFlag: true, errorMsg: data.msg})
        }
        
    })
    .catch(e=> {
        console.log(e)
        // this.setState({toasterFlag: true, errorMsg: d.msg})
    })

    
};

componentDidUpdate(prevProps,prevState){

    if(prevState.flag !== this.state.flag){

        const payload = {
            depositCoin: this.state.currencySend,
            destinationCoin: this.state.currencyReceive
        }

        console.log('flag change')
        rateapi(payload)
        .then((res)=>{
            console.log(res.data.data)
            const data = res.data;
            console.log(res)
            if(data.success){
                this.setState({flag: false, exchangeRate: data.data.rate})
               
            }
            else{
                this.setState({toasterFlag: true, errorMsg: data.msg})
            }
        })
        .catch(e => {
            console.log(e)
            // this.setState({toasterFlag: true, errorMsg: e.msg})
        })
    }
}
 
handleCheckBox = (event) => {
    this.setState({[event.target.name]: event.target.checked })
};

onChange = (e) => {
    console.log(e.target.value)
    console.log(e.target.name)
    this.setState({[e.target.name] : e.target.value})
}

sendDrop = (value) => {
    if(value){
        this.setState({currencySend : value.symbol, flag: !this.state.flag});
        // this.getExchange();
        // this.setState({flag: false})
    }
    else{
        this.setState({currencySend : null});
    }
    console.log(value)
}

receiveDrop = (value) => {
    if(value){
        this.setState({currencyReceive : value.symbol, flag: !this.state.flag});
    }
    else{
        this.setState({currencyReceive : null})
    }
    console.log(value)
}

handleClose = () => {
    this.setState({toasterFlag: false})
}

render() {
    return (
        <div className="wrapper">
            <div className = "dash">
                <div className = "dashInput">
                    <div className= "buyCrypto">
                       Send {this.state.currencySend} 
                    </div>
                        <div className= "inputCurr">
                          <TextField variant="outlined" style={{ flex:0.5 }}  value={this.state.sendCoin} name="sendCoin" onChange = {this.onChange}  />
                          <Autocomplete
                            onChange = {(event, value)=>this.sendDrop(value)} 
                            id="currencySend"
                            options ={this.state.dataDropdown}
                            getOptionLabel={(option) => option.symbol }
                            renderOption={option => (
                                <div className="renderOption">
                                  <div className="logoSize1">{<img src={option.logoUrl} className="logoSize" alt=""></img>}</div>
                                  <div style={{padding:"20px", fontWeight:"bold"}}>{option.symbol.toUpperCase()}</div>
                                  <div> {option.name}</div>
                                </div>
                            )}
                            style={{ flex:0.4 }}
                            renderInput={(params) => <TextField {...params}  label={this.state.currencySend} variant="outlined" />}
                          />
                        </div>

                        <div className = "refundAddress">
                            
                        </div>
                    </div>
                    <div className = "dashLoader">
                      <AutorenewTwoToneIcon />
                    </div>
                    <div className = "dashOutput">
                    
                        <div className = "marketRate">
                            <div>Get {this.state.currencyReceive}</div>
                            <div className = "checkedWrapper">
                                <span>Market Rate</span>
                                <Switch
                                    checked={this.state.checked}
                                    onChange={this.handleChange}
                                    name="checkedA"
                                    inputProps={{ "aria-label": "secondary checkbox" }}
                                />
                                <span>Fixed Rate</span>
                            </div> 
                        </div>
                        <div className = "outputCurr">
                            <TextField variant="outlined" style={{ flex:0.5 }} disabled value = {this.state.exchangeRate*this.state.sendCoin}/>
                            <Autocomplete
                                onChange = {(event, value)=>this.receiveDrop(value)} 
                                id="currencyReceive"
                                options ={this.state.dataDropdown}
                                getOptionLabel={(option) => option.symbol }
                                renderOption={option => (
                                    <div className="renderOption">
                                    <div className="logoSize1">{<img src={option.logoUrl} className="logoSize" alt=""></img>}</div>
                                    <div style={{padding:"20px", fontWeight:"bold"}}>{option.symbol.toUpperCase()}</div>
                                    <div> {option.name}</div>
                                </div>
                            )}
                            style={{ flex:0.4 }}
                            renderInput={(params) => <TextField {...params} label={this.state.currencyReceive} variant="outlined" />}
                          />
                                
                        </div>
                        <div className= "refundOutputAddress">
                          <TextField label="Enter Ethereum Address"  style={{ flex:0.5, flexBasis:"60%" }}/>
                        </div>
                    </div>

                </div>
                {this.state.toasterFlag ? 
                <Snackbar open={this.state.toasterFlag} autoHideDuration={6000} onClose={this.handleClose} anchorOrigin={{ vertical: "center", horizontal: "center"}}>
                    <Alert onClose={this.handleClose} severity="error">
                      {this.state.errorMsg}
                    </Alert>
                </Snackbar>
                : null }
                <div className = "exchange">
                    <div className = "exchangeTab">
                        <div className="sending">
                            <div className = "wrapsend">
                                <div className = "sendingMsg">
                                    You are sending
                                </div>
                                <div className="sendingAmount">
                                    {this.state.sendCoin} <sup>{this.state.currencySend}</sup>
                                </div>


                            </div>
                         
                        </div>
                        <div className="arrow">
                          <ArrowRightAltRoundedIcon />
  
                        </div>
                        <div className="receiving">
                            <div className= "wrapreceive">
                                <div className = "receivingMsgWithIcon">
                                    <div style = {{paddingRight:"10px"}}>
                                        You may receive
                                    </div>
                                    <div>
                                        <Tooltip title="This is currrent rate. Final amount you receive may vary due to rate fluctuations." placement="left-end">
                                            <InfoRoundedIcon>bottom</InfoRoundedIcon>
                                        </Tooltip>
                                    </div>
                                </div>
                         
                                <div className="receivingAmount">
                                   {this.state.exchangeRate*this.state.sendCoin} <sup>{this.state.currencyReceive}</sup>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className = "poweredBy">
                        <div>powered by Simplex</div>
                    </div>
                </div>

                {/* <CircularProgress variant="determinate" value={this.state.progress} /> */}

                <div className = "accept">
                    <div className= "termsCondition">
                        <Checkbox
                            checked={this.state.checkBox}
                            onChange={this.handleCheckBox}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <p>I agree to <a href="#">terms</a> & <a href="#">privacy policy</a></p>
                    </div>

                    <div className="submit">
                        <Button variant="contained" size="large" color="primary" >
                            EXCHANGE
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;