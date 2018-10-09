import React, { Component } from "react";
import API from "../../utils/API";
import { Column, Row, Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";
import { List, Listitem } from "../../components/List";
import Button from "../../components/Button";
import Card from "../../components/Card";
import DatePicker from "react-datepicker";
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';
import swal from "sweetalert";

class Articles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            startDate: null,
            endDate: null,
            results: [],
            saved: [],
            date: moment().format("DD-MM-YYYY")
        }
    }

    componentDidMount()
    {
        this.getAllSaved();
    }

    handleChange = ({startDate, endDate}) => {
        startDate = startDate || this.state.startDate
        endDate = endDate || this.state.endDate
        if (startDate.isAfter(endDate))
        {
            endDate = startDate
        }

        this.setState({ startDate, endDate})
    }

    handleStart = (startDate) => {
        this.handleChange({ startDate })
    }

    handleEnd = (endDate) => {
        this.handleChange({ endDate })
    }

    handleInput = e => {
        const {name, value } = e.target;
        this.setState({
            [name]: value
        });
    };
    handleForm = e => {
        e.preventDefault();

        if(!this.state.title)
        {
            swal({
                title: "Please enter a title!",
                icon: "warning",
                dangerMode: true,
              });
            return;
        }

    if (this.state.title && this.state.startDate && this.state.endDate) {
        this.setState({
          results: []
        })
        API.getArticles(
          this.state.title,
          this.state.startDate.format("YYYYMMDD"),
          this.state.endDate.format("YYYYMMDD")
        )
          .then((res) => {
            if (res.data.response.docs.length) {
              for (let i = 0; i < 10; i++) {
                this.setState({
                  results: this.state.results.concat(res.data.response.docs[i])
                })
              }
  
            } else {
              swal({
                title: "No Data! Please Try Again",
                icon: "warning",
                dangerMode: true,
              })
            }
  
          })
          .catch(err => console.log(err));
      }
  
    };

    saveArticle = (index) => {
        let { headline: title, web_url: url, pub_date: date } = this.state.results[index]
        this.setState({
          results: this.state.results.filter((_, i) => i !== index)
        });
        let savedDate = this.state.date; 
        API.saveArticle({
          title: title.main,
          url,
          date, 
          savedDate
        })
          .then(res => {
            this.getAllSaved();
          })
          .catch(err => console.log(err));
      };

      getAllSaved = () => {
        API.getSavedArticles()
          .then(res => this.setState({
            saved: [...res.data]
          }))
          .catch(err => console.log(err));
      };

      deleteArticle = (id) => {
        API.deleteArticle(id)
          .then(() => {
            this.getAllSaved()
          })
          .catch(err => console.log(err));
      };

      render() {
        return (
          <Container>
          <Row className="w-100 full-br">
            <Column size="12" className="p-0">
            
              <Row>
                {/* Check if there are any to save using ternary */}
                <Column size="lg-6" className="p-0">
                  <Card header="Saved" className="cardBr">
                    {this.state.saved.length ? (
                      <List>
                        {this.state.saved.map((saved) => (
                          <Listitem
                            key={saved._id}
                            url={saved.url}
                            title={saved.title}
                            savedDate={saved.savedDate}
                            date={moment(saved.date, "YYYY-MM-DD").format("DD-MM-YYYY")}>
                            <Button onClick={() => this.deleteArticle(saved._id)}>
                              Delete
                          </Button>
                          </Listitem>
                        ))}
                      </List>
                    ) : (
                        <h3>Nothing Saved</h3>
                      )}
                  </Card>
                </Column>
                {/* Input Card for sending queries */}
                <Column size="lg-6" className="p-0">
                  <Card header="Search">
                    <form>
                      <Input
                        value={this.state.title}
                        onChange={this.handleInput}
                        name="title"
                        placeholder="Title (required)"
                      />
                      {/* Sub row for saved and search cards */}
                      <Row>
                        <Column size="sm-6" className="p-0">
                          <p className="d-inline">Start:</p>
                          <DatePicker
                            className="rounded p-1"
                            selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleStart}
                          />
                        </Column>
                        <Column size="sm-6" className="p-0">
                          <p className="d-inline">End:</p>
                          <DatePicker
                            className="rounded p-1"
                            selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleEnd}
                          />
                        </Column>
                      </Row>
                      <FormBtn
                        onClick={this.handleForm}>
                        Submit Search
                      </FormBtn>
                    </form>
                  </Card>
                </Column>
              </Row>
              
              <Card header="Results">
                {this.state.results.length ? (
                  <List>
                    {this.state.results.map((article, index) => (
                      <Listitem
                        key={article.web_url}
                        url={article.web_url}
                        title={article.headline.main}
                        date={moment(article.pub_date, "YYYY-MM-DD").format("DD-MM-YYYY")}>
                        <Button onClick={() => this.saveArticle(index)}>
                          Save!
                          </Button>
                      </Listitem>
                    ))}
                  </List>
                ) : (
                    <h3>No Results to Display</h3>
                  )}
              </Card>
            </Column>
          </Row>
          </Container>
        );
      }
}

export default Articles;