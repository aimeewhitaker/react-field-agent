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

  cancelHandler = (event) => {
    event.preventDefault();
    this.setState({
      mode: 'Add',
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

  renderTableData() {
    return this.state.agents.map((agent) => {
       return (
          <tr key={agent.agentId}>
            <td>{agent.agentId}</td>
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
       );
    });
 } 

  renderTableHeader() {
  let header = ['ID', 'First Name', 'Middle Name', 'Last Name', 'DOB', 'Height'];
  return header.map((key, index) => {
     return <th key={index}>{key.toUpperCase()}</th>
  })
  }

  render() {

    const {
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
                <input className="firstName" value={this.firstName} onChange={this.changeHandler} placeholder="first name" type="text" />
              </div>
              <div>
                <input className="middleName" value={this.middleName} onChange={this.changeHandler} placeholder="middle name" type="text" />
              </div>
              <div>
                <input className="lastName" value={this.lastName} onChange={this.changeHandler} placeholder="last name" type="text" />
              </div>
              <div>
                <input className="dob" value={this.dob} onChange={this.changeHandler} placeholder="date of birth (yyyy-mm-dd)" type="text" />
              </div>
              <div>
                <input className="heightInInches" value={this.heightInInches} onChange={this.changeHandler} placeholder="height in inches" type="text" />
              </div>
              <button className="btn btn-success ml-2" type="submit">Add Agent</button>
            </form> 
          )}

          {mode === 'Edit' && (
            <form className="form-inline p-3" onSubmit={this.editSubmitHandler}>
              <div>
                <input className="firstName" value={this.state.firstName} onChange={this.changeHandler} type="text" />
              </div>
              <div>
                <input className="middleName" value={this.state.middleName} onChange={this.changeHandler} type="text" />
              </div>
              <div>
                <input className="lastName" value={this.state.lastName} onChange={this.changeHandler} type="text" />
              </div>
              <div>
                <input className="dob" value={this.state.dob} onChange={this.changeHandler} type="text" />
              </div>
              <div>
                <input className="heightInInches" value={this.state.heightInInches} onChange={this.changeHandler} type="text" />
              </div>
              <button className="btn btn-success ml-2" type="submit">Confirm Edits</button>
            </form>  
          )}

          {mode === 'Edit' && (
            <form className="cancel" onSubmit={this.cancelHandler}>
              <button className="cancel" type="submit">Cancel</button>
            </form>
          )}

          <div>
            <h1 id='title'>Agent Details</h1>
            <table id='agents'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
          </div>
      </>
    );
  }// end of render
}

export default Agent;

