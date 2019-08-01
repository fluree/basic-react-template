import React, { Component } from 'react';
import { Form, Button, Row, Col, Container, Table } from 'react-bootstrap'
import { flureeFetch } from './flureeFetch'
// import logo from './logo.svg';
import './App.css';
// import { FORMERR } from 'dns';

const sleep = (ms) => {
  return new Promise(res => setTimeout(res, ms))
}

class PersonForm extends Component {
  state = {
    name: "",
    email: ""
  }

  handleChange = (e) => {
    const key = e.target.name
    this.setState({ [key]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const transaction = [{
      "_id": "person",
      "name": this.state.name,
      "email": this.state.email
    }]

    flureeFetch('/transact', transaction)
    .then(res => {
      sleep(200).then(() => {
        this.setState({ name: '', email: '' })
        this.props.refreshEvents()
        this.props.refreshPeople()
      })
    }).catch(err => {
      console.log(err)
    })
    
  }

  render() {
    return(
      <Col>
        <div className="text-center"><h2>Form for New Person</h2></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Name of Person</Form.Label>
            <Form.Control type="text" name="name" placeholder="e.g. John Doe" onChange={this.handleChange} value={this.state.name}></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="e.g. JohnDoe@gmail.com" onChange={this.handleChange} value={this.state.email}></Form.Control>
          </Form.Group>
          <Button disabled={(!this.state.email || !this.state.name)} variant="primary" type="submit">Submit!</Button>
        </Form>
      </Col>
    )
  }
}

class EventForm extends Component {
  state = {
    name: "",
    location: ""
  }

  handleChange = (e) => {
    const key = e.target.name
    this.setState({ [key]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const transaction = [{
      "_id": "event",
      "name": this.state.name,
      "location": this.state.location
    }]

    flureeFetch('/transact', transaction)
    .then(res => {
      this.setState({ name: '', location: '' })
      this.props.refreshEvents()
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return(
      <Col>
        <div className="text-center"><h2>Form for New Event</h2></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Name of Event</Form.Label>
            <Form.Control type="text" name="name" placeholder="e.g. Pizza at the Park" onChange={this.handleChange} value={this.state.name}></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Event Location</Form.Label>
            <Form.Control type="text" name="location" placeholder="e.g. Central Park" onChange={this.handleChange} value={this.state.location}></Form.Control>
          </Form.Group>
          <Button disabled={(!this.state.name || !this.state.location)} variant="primary" type="submit">Submit!</Button>
        </Form>
      </Col>
    )
  }
}

class AssociateEventsForm extends Component {
  state = {
    person: this.props.people[0]._id,
    event: this.props.events[0]._id
  }

  handleChange = (e) => {
    const key = e.target.name
    let value

    if(key === "person") {
      value = this.props.people.find(person => person["person/name"] === e.target.value)["_id"]
    } else if(key === "event") {
      value = this.props.events.find(event => event["event/name"] === e.target.value)["_id"]
    }

    this.setState({ [key]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    const transaction = [{
      "_id": this.state.person,
      "events": [this.state.event]
    },
    {
      "_id": this.state.event,
      "attendees": [this.state.person]
    }]

    flureeFetch('/transact', transaction)
    .then(res => {
      sleep(200).then(() => {
        this.props.refreshPeople()
        this.props.refreshEvents()
      })
    }).catch(err => {
      console.log(err)
    })
    
  }

  componentDidUpdate(prevProps) {
    if (prevProps.people[0]._id !== this.props.people[0]._id) {
      this.setState({ person: this.props.people[0]._id, event: this.props.events[0]._id })
    }
  }

  render() {
    return(
      <Col className="my-2">
        <div className="text-center"><h2>RSVP People for Events</h2></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Person</Form.Label>
            <Form.Control as="select" name="person" onChange={this.handleChange}>
              {this.props.people.map(person => {
                return (<option key={person["_id"]}>{person["person/name"]}</option>)
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Event</Form.Label>
            <Form.Control as="select" name="event" onChange={this.handleChange}>
              {this.props.events.map(event => {
                return (<option key={event["_id"]}>{event["event/name"]}</option>)
              })}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">Submit!</Button>
        </Form>
      </Col>
    )
  }
}

class Index extends Component {

  handleDelete = (e, id) => {
    e.preventDefault();

    const transaction = [{
      "_id": id,
      "_action": "delete"
    }]

    flureeFetch('/transact', transaction)
    .then(res => {
      sleep(200).then(() => {
        this.props.refreshPeople()
        this.props.refreshEvents()
      })
    }).catch(err => {
      console.log(err)
    })
    
  }

  render() {
    return(
      <div>
        {this.props.people[0] && <Row>
          <Col className="text-center"><h3>People</h3></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Events</th>
                <th>Delete User?</th>
              </tr>
            </thead>
            <tbody>
              {this.props.people.map(person => {
                return(
                  <tr key={person["_id"]}>
                    <td>{person["person/name"]}</td>
                    <td>{person["person/email"]}</td>
                    <td>{person["person/events"] && person["person/events"].map(event => event["event/name"]).join(", ")}</td>
                    <td><Form onSubmit={(e) => this.handleDelete(e, person["_id"])}><Button type="submit" variant="danger" size="sm">Delete</Button></Form></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Row>}
        {this.props.events[0] && 
        <Row>
          <Col className="text-center"><h3>Events</h3></Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Delete Event?</th>
              </tr>
            </thead>
            <tbody>
              {this.props.events.map(event => {
                return(
                  <tr key={event["_id"]}>
                    <td>{event["event/name"]}</td>
                    <td>{event["event/location"]}</td>
                    <td>{event["event/attendees"] && event["event/attendees"].map(person => person["person/name"]).join(", ")}</td>
                    <td><Form onSubmit={(e) => this.handleDelete(e, event["_id"])}><Button type="submit" variant="danger" size="sm">Delete</Button></Form></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Row>}
      </div>
    )
  }
}

class App extends Component {
  state = {
    people: [],
    events: []
  }

  refreshPeople = () => {
    const query = {
      "select": [
        "*", 
        { "person/events": ["*"] }
      ],
      "from": "person"
    }

    flureeFetch('/query', query)
    .then(res => {
      // debugger;
      this.setState({ people: res })
    })
    .catch(err => {
      console.log(err)
    })
  }

  refreshEvents = () => {
    const query = {
      "select": [
        "*", 
        { "event/attendees": ["*"] }
      ],
      "from": "event"
    }

    flureeFetch('/query', query)
    .then(res => {
      // debugger;
      this.setState({ events: res })
    })
    .catch(err => {
      console.log(err)
    })
  }

  componentDidMount() {
    this.refreshPeople()
    this.refreshEvents()
  }

  render() {
    const { refreshEvents, refreshPeople } = this
    const { people, events } = this.state
    const props = { refreshEvents, refreshPeople, events, people }
    return (
      <Container>
  
        <Row className="my-4">
          <PersonForm className="col-sm" {...props} ></PersonForm>
          <EventForm className="col-sm" {...props} ></EventForm>
        </Row>
  
        {
          people[0] && events[0] &&
          <Row className="my-2"><AssociateEventsForm {...props} ></AssociateEventsForm></Row>
        }
  
        <Index {...props} ></Index>
  
      </Container>
    );
  }
}

export default App;