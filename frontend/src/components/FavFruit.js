import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
const axios = require('axios');
import { withAuth0 } from '@auth0/auth0-react';
require('dotenv').config();
import UpdateModal from './UpdateModal';

class FavFruit extends React.Component {
  constructor(props) {
    super(props);
    this.setState = {
      allFruit: [],
      selectedItem: {},
      showUpdate: false
    }
  }
  showModal = (fruit) => this.setState({ showUpdate: true, selectedItem: fruit });
  handleClose = () => this.setState({ showUpdate: false });

  updateBtn = (e) => {
    this.showModal(fruit);
    e.preventDefault();
    const reqBody = {
      name: e.target.name.value,
      image: e.target.image.value,
      price: e.target.price.value,
      email: this.props.withAuth0.user.email
    }
    axios.put(`${process.env.REACT_APP_KEY_API}/fruits/${this.state.selectedItem._id}`, reqBody).then(result => {
      this.setState({
        allFruit: result,
      })
    })
    this.handleClose();
  }

  deleteBtn = (itemID) => {
    axios.delete(`${process.env.REACT_APP_KEY_API}/fruits/${this.state.selectedItem._id}`).then(result => {
      if (result.data.deleteCount === 1) {
        const newFruitsArr = this.state.allFruit.filter(item => item._id === itemID);
        this.setState({ allFruit: result });
      }
    })

  }

  componentDidMount = () => {
    axios.get(`${process.env.REACT_APP_KEY_API}/fruits/${this.props.withAuth0.user.email}`).then(result => {
      this.setState({ allFruit: result.data });
    });
  }
  render() {
    return (
      <>
        {this.state.allFruit.map(fruit => {
          return (
            <>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={fruit.image} />
                <Card.Body>
                  <Card.Title>{fruit.name}</Card.Title>
                  <Card.Text>{fruit.price}</Card.Text>
                  <Button variant="danger" onclick={() => this.deleteBtn(fruit._id)}>Delete</Button>
                  <Button variant="primary" onclick={(e) => this.updateBtn(e)}>Update</Button>
                </Card.Body>
              </Card>
              <UpdateModal
                show={this.state.showUpdate}
                onhide={this.handleClose}
                updateFlower={this.updateBtn}
                selectedItem={this.state.selectedItem}
              />
            </>
          )
        })
        }
      </>
    )
  }
}

export default withAuth0(FavFruit);