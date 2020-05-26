import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Graph from "./graph";

class Index extends React.Component {
  documentData;
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pageNo: 0,
      TotalPage: 0
    };
  }

  DataHandler(pageNumber) {
    let url = `https://hn.algolia.com/api/v1/search?page=${pageNumber}`;
    axios
      .get(url, {
        responseType: "json"
      })
      .then(response => {
        this.setState({
          tableData: response.data.hits,
          pageNo: pageNumber,
          TotalPage: response.data.nbPages
        });
        localStorage.setItem("document", JSON.stringify(this.state));
      });
  }

  componentDidMount() {
    this.documentData = JSON.parse(localStorage.getItem("document"));
    console.log("this.documentData: ", this.documentData);
    if (this.documentData === null) {
      this.DataHandler(0);
    } else {
      this.setState({
        tableData: this.documentData.tableData,
        pageNo: this.documentData.pageNo,
        TotalPage: this.documentData.TotalPage
      });
    }
  }

  renderNews(news, index) {
    let d = new Date(news.created_at);
    var diffTime = Date.now() - d;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (
      <tr key={index}>
        <td>{news.num_comments}</td>
        <td>{news.points}</td>
        <td>
          <Button variant="primary" onClick={() => this.upvoteHandler(index)}>
            Upvote
          </Button>{" "}
          {" "}
        </td>
        <td>
          {news.title}{" "}
          <small style={{ color: "grey" }}>
            (<a href={news.url}>{news.url}</a>) by{" "}
          </small>
          <small> {news.author} </small>
          <small style={{ color: "grey" }}> {diffDays} days ago. [ </small>
          <small onClick={() => this.hideHandler(index)}>Hide </small>
          <small style={{ color: "grey" }}>] </small>
        </td>
      </tr>
    );
  }

  paginationHandler(GoToPageNo) {
    if (GoToPageNo >= 0) {
      this.DataHandler(GoToPageNo);
    } else {
      console.log(`Can't fetch data for page -1`);
    }
  }

  hideHandler(index) {
    let data = this.state.tableData;
    data.splice(index, 1);
    this.setState({
      tableData: data
    });
    localStorage.setItem("document", JSON.stringify(this.state));
  }

  upvoteHandler(index) {
    let data = this.state.tableData;
    data[index].points = data[index].points + 1;
    this.setState({
      tableData: data
    });
    localStorage.setItem("document", JSON.stringify(this.state));
  }

  render() {
    const data = this.state.tableData;
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossorigin="anonymous"
        />

        <Card>
          <Card.Body>
            <h3>Hacker News </h3>

            {/*<FontAwesomeIcon icon={faCoffee} />*/}
            <Table bordered hover size="sm" responsive="md">
              <thead>
                <tr style={{ backgroundColor: "orange" }}>
                  <th>Comments</th>
                  <th>VoteCounts</th>
                  <th>UpVote</th>
                  <th>News Details</th>
                </tr>
              </thead>
              <tbody>{data.map(this.renderNews.bind(this))}</tbody>
            </Table>
            <h5>
              <Button
                variant=""
                size="sm"
                onClick={() => this.paginationHandler(this.state.pageNo - 1)}
              >
                Previous
              </Button>{" "}
              |{" "}
              <Button
                variant=""
                size="sm"
                onClick={() => this.paginationHandler(this.state.pageNo + 1)}
              >
                Next
              </Button>{" "}
              {" "}
            </h5>
            <Card.Body>
              <Graph data={data} />
            </Card.Body>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Index;
