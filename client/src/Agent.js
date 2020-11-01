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
      dob: '',
      heightInInches: 0,
      errors: [],
      mode: 'Add',
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
        [event.target.className]: event.target.value
    });
  }

  
  editSubmitHandler = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8080/api/agent/${this.state.agentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        firstName: this.state.firstName,
        middleName: this.state.middleName === '' ? null : this.state.middleName,
        lastName: this.state.lastName,
        dob: this.state.dob === '' ? null : this.state.dob,
        heightInInches: this.state.heightInInches,
      }),
    })
      .then((response) => {
        if (response.status === 204) {
          this.setState({
            agentId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            heightInInches: 0,
            errors: [],
            mode: 'Add',
          });
          this.getAgents();
        } else if (response.status === 400) {
          response.json().then((data) => this.setState({
            errors: data,
          }));
        } 
        else if (response.status === 500) {
          response.json().then(data => console.log(data));
        }
        else {
          console.log("yeah that didn't work");
        }
      });
  }

  addSubmitHandler = (event) => {
    event.preventDefault();
    fetch('http://localhost:8080/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        middleName: this.state.middleName === '' ? null : this.state.middleName,
        lastName: this.state.lastName,
        dob: this.state.dob === '' ? null : this.state.dob,
        heightInInches: this.state.heightInInches,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then(data => console.log(data));
          this.setState({
            agentId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            heightInInches: 0,
            errors: [],
            mode: 'Add',
          });
          this.getAgents();
        } else if (response.status === 400) {
          response.json().then((data) => this.setState({
            errors: data,
          }));
        }
        else if (response.status === 500) {
          response.json().then(data => console.log(data));
        }
        else {
          console.log("yeah that didn't work");
        }
      });
  }

  editAgent = (agentId) => {
    fetch(`http://localhost:8080/api/agent/${agentId}`)
      .then((response) => response.json())
      .then(({ agentId, firstName, middleName, lastName, dob, heightInInches }) => {
        this.setState({
          agentId,
          firstName,
          middleName,
          lastName,
          dob,
          heightInInches,
          mode: 'Edit',
        });
      });
  }

  deleteAgent = (agentId) => {
    fetch(`http://localhost:8080/api/agent/${agentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          this.getAgents();
        }
        else if (response.status === 500) {
          response.json().then(data => console.log(data));
        }
        else {
          console.log("yeah that didn't work");
        }
      });
  }

  render() {

    const {
      agents,
      errors,
      mode,
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

          {mode === 'Add' && (      
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
          )}

          {mode === 'Edit' && (
            <form className="form-inline p-3" onSubmit={this.editSubmitHandler}>
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
              <button className="btn btn-success ml-2" type="submit">Update Agent</button>
            </form>
         )}

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
                <td>
                  <div className="float-right">
                    <button className="btn btn-sm btn-primary mr-2" type="button" onClick={() => this.editAgent(agent.agentId)}>Edit</button>
                    <button className="btn btn-sm btn-danger" type="button" onClick={() => this.deleteAgent(agent.agentId)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default Agent;

