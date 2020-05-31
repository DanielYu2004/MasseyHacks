import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import DriverCard from "../../Components/DriverCard/DriverCard.js"

import {
    geocodeByAddress,
    geocodeByPlaceId,
    getLatLng,
  } from 'react-places-autocomplete';


import "./Order.css"

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            reqSent : true,
            address : "",
            seats : "",
            cost: null
        }
    }

    showPosition = pos => {
        this.setState({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        })
    
        console.log(this.state);
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            alert("YOU NEED TO GIVE YOUR LOCATION IN ORDER FOR THIS DECENTRALIZED APPLICATION TO FULLY OPERATE");
        }   
    }

    handleChange = address => {
        var temp = {}
        temp.target = {}
        temp.target.placeholder = "Address"
        temp.target.value = address

        this.setState({ address : address});
    };

    // React Autocomplete Component
    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log('Success', latLng)
                this.setState({lat : latLng.lat, long : latLng.lng})
            })
            .catch(error => console.error('Error', error));
    };

    autocomplete = (e) => {
        // To update address values from the React Autocomplete component to Referral parent component
        // since the Autocomplete component's behaviour was different with the MUI textfield.
        // it just formats the data and then calls this.updateData()
        e.target.placeholder = "Address"
        e.target.value = e.target.textContent
        this.updateData(e) 
    }

    updateData(e){
        // To update the state of Card component and then pass data to parent Referral component
        this.setState({address : e.target.value})
    }

    sendOrder(){
        const COST = this.generateCost(this.state.latitude, this.state.longitude, this.state.lat, this.state.long);
    }
    
    generateCost = (lat1, lon1, lat2, lon2) => {
        const φ1 = lat1 * Math.PI/180, φ2 = lat2 * Math.PI/180, Δλ = (lon2-lon1) * Math.PI/180, R = 6371e3;
        const d = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;
        const dCost = Math.round(((d/700) + Number.EPSILON) * 100) / 100;
        this.setState({
            cost: dCost
        })
        return dCost;

    }

    handleSubmit = () => {
        

    }

    render() { 
        return (
            <div className="order-page-div">
                <div className="order-page-header">
                    Place an Order
                </div>

                    <div className="order-page-form-div">
                        <div className="form-form">
                            <div style={{height : "50px"}}>
                                <PlacesAutocomplete
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            onSelect={this.handleSelect}
                                        >
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div style={{width : "250px", height : "0px"}}>
                                                <TextField
                                                label="required"
                                                required
                                                id="standard-required"
                                                autoComplete="off"
                                                onChange={(e) => this.updateData(e)}
                                                InputProps={{
                                                    startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                    ),
                                                }}
                                                placeholder="Address"
                                                fullWidth
                                                {...getInputProps({
                                                    className: 'location-search-input',
                                                })}
                                                />
                                                <div className="autocomplete-dropdown-container">
                                                {loading && <div>Loading...</div>}
                                                {suggestions.map(suggestion => {
                                                    const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';

                                                    const style = suggestion.active
                                                    ? { background: '#DFEDF0', cursor: 'pointer' }
                                                    : { background: 'white', cursor: 'pointer' };
                                                    return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                        })}
                                                        placeholder="Address" value={suggestion.description} onClick={(e)=> this.autocomplete(e)}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                    );
                                                })}
                                                </div>
                                            </div>
                                            )}
                                </PlacesAutocomplete>
                            </div>

                            <div style={{height : "50px", color : "white"}}></div>

                                
                            <div style={{height : "50px", width : "250px"}}>
                                <TextField
                                required
                                fullWidth 
                                id="standard-basic" 
                                onChange={(e) => this.setState({seats : e.target.value})}
                                label="Number of Seats"
                                ></TextField>
                            </div> 
                            <div style={{height : "50px", color : "white"}}></div>
                            <Button variant="contained" color="primary" onClick={() => this.sendOrder()}>
                                Submit
                            </Button>
                        </div>
                        <div className="order-result">
                            {this.state.reqSent 
                            ? 
                                this.state.loading 
                                ?
                                <CircularProgress/> 
                                : 
                                <div style={{display : "flex"}}>
                                    <div style={{display : "flex", flexDirection : "column", width : "fit-content"}}>
                                        <div className="potential-drivers-header">Potential Drivers</div>
                                        <DriverCard name="Jerome" />
                                        <DriverCard name="DeShawn" />
                                        <DriverCard name="Tyrone" />
                                        <DriverCard name="Terrance" />
                                        <DriverCard name="Jamal" />
                                    </div>
                                    <div className="drivers-est-cost">
                                        <div style={{fontSize : "20px"}}>
                                            Estimated Cost:
                                        </div>
                                        <div style={{fontSize : "40px", marginTop : "30px"}}>{this.state.cost} </div>
                                    </div>
                                </div>
                            :
                            null
                            }
                            
                        </div>
                    <div/>
                </div>
    
            </div>
        );
    }
}
 
export default Order;