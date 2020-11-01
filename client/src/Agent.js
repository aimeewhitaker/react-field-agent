import React from 'react';

class Agent extends React.Component {
  constructor() {
    super();
    this.state = {
      agents: [],
      agentId: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      dob: 0,
      heightInInches: 0,
      errors: [],
    };
  }

  componentDidMount() {
    this.getAgents();
  }

  getAgents = () => {
    fetch('http://localhost:8080/api/agent')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          agents: data,
      });
    });
  }

  changeHandler = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    });
  }


  addSubmitHandler = (event) => {
    event.preventDefault();

    const {
      firstName,
      middleName,
      lastName,
      dob,
      heightInInches,
    } = this.state;

    fetch('http://localhost:8080/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        middleName,
        lastName,
        dob,
        heightInInches,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            firstName: '',
            middleName: '',
            lastName: '',
            dob: 0,
            heightInInches: 0,
            errors: [],
          });
          this.getAgents();
        } else if (response.status === 400) {
          response.json().then((data) => this.setState({
            errors: data,
          }));
        } else {
          throw new Error(`Unexpected response: ${response}`);
        }
      });
  }

  render() {

    const {
      agents,
      errors,
    } = this.state;

    return (
      
      <>
        <h2 className="my-3">Agents</h2>

          {errors.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <p>The following errors occurred:</p>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}


         <form className="form-inline p-3" onSubmit={this.addSubmitHandler}>
            <div>
              <input className="firstName" value={this.firstName} onChange={this.changeHandler} placeholder="Enter a first name..." type="text" />
            </div>
            <div>
              <input className="middleName" value={this.middleName} onChange={this.changeHandler} placeholder="Enter a middle name.." type="text" />
            </div>
            <div>
              <input className="lastName" value={this.lastName} onChange={this.changeHandler} placeholder="Enter a last name..." type="text" />
            </div>
            <div>
              <input className="dob" value={this.dob} onChange={this.changeHandler} placeholder="Enter a date of birth" type="text" />
            </div>
            <div>
              <input className="heightInInches" value={this.heightInInches} onChange={this.changeHandler} placeholder="Enter a height in inches..." type="text" />
            </div>
            <button className="btn btn-success ml-2" type="submit">Add Agent</button>
          </form> 

        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Agent Details</th>
              <th scope="col">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.agentId}>
                <td>{agent.firstName}</td>
                <td>{agent.middleName}</td>
                <td>{agent.lastName}</td>
                <td>{agent.dob}</td>
                <td>{agent.heightInInches}</td>  
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default Agent;

