import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
const axios = require('axios');
import { withAuth0 } from '@auth0/auth0-react';
require('dotenv').config();

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.setState = {
            allFruit: [],
            selectedItem: {}
        }
    }
    addFavBtn = (fruit) => {
        const reqBody = {
            name: fruit.name,
            image: fruit.image,
            price: fruit.price,
            email: fruit.email
        }
        axios.put(`${process.env.REACT_APP_KEY_API}/fruits`, reqBody).then(result => {
            console.log(result);
        })

    }
    componentDidMount = () => {
        axios.get(`${process.env.REACT_APP_KEY_API}/fruits`).then(result => {
            this.setState({ allFruit: result.data });
        });
    }
    render() {
        return (
            <>
                {this.state.allFruit.map(fruit => {
                    return (
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={fruit.image} />
                            <Card.Body>
                                <Card.Title>{fruit.name}</Card.Title>
                                <Card.Text>{fruit.price}</Card.Text>
                                <Button variant="primary" onclick={() => this.addFavBtn(fruit)}>Add to Favourites</Button>
                            </Card.Body>
                        </Card>
                    )
                })
                }
            </>
        )
    }
}

export default withAuth0(Home);