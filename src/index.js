import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Grid, Row, Col } from "react-flexbox-grid";
import { roslib } from "roslib";
import { useROS, ROS } from "react-ros";

class App extends React.Component {
  render() {
    return (
      <ROS>
        <ToggleConnect />
        <EchoTopic />
      </ROS>
    );
  }
}

function ToggleConnect() {
  const { isConnected, topics, url, changeUrl, toggleConnection } = useROS();
  return (
    <div>
      <p>
        <b>Simple connect: </b>
        <button onClick={toggleConnection}>Toggle Connect</button> <br />
        <b>ROS url input: </b>
        <input
          name="urlInput"
          defaultValue={url}
          onChange={(event) => changeUrl(event.target.value)}
        />{" "}
        <br />
        <b>ROS url to connect to: </b> {url} <br />
        <b>Status of ROS:</b> {isConnected ? "connected" : "not connected"}{" "}
        <br />
        <b>Topics detected:</b>
        <br />
        {topics.map((topic, i) => (
          <li key={i}> {topic.path}</li>
        ))}
      </p>
    </div>
  );
}

var listener = null;
function EchoTopic() {
  const { createListener, topics } = useROS();
  const [topic, setTopic] = useState("/");
  const [queue, setQueue] = useState(0);
  const [compression, setCompression] = useState("none");
  useEffect(() => {
    handleTopic(topic);
  });
  const unsubscribe = () => {
    if (listener) {
      console.log("Unsubscribing");
      listener.unsubscribe();
    }
  };
  const handleTopic = (topicInput) => {
    if (topic !== topicInput) {
      setTopic(topicInput);
      unsubscribe();
      return;
    }
    unsubscribe();
    listener = null;
    for (var i in topics) {
      if (topics[i].path == topicInput) {
        listener = createListener(
          topics[i].path,
          topics[i].msgType,
          Number(queue),
          compression
        );
        break;
      }
    }
    if (listener) {
      console.log("Subscribing to messages...");
      listener.subscribe(handleMsg);
    } else {
      console.log(
        "Topic '" +
          topic +
          "' not found...make sure to input the full topic path - including the leading '/'"
      );
    }
  };
  const handleQueue = (queueInput) => {
    setQueue(queueInput);
  };
  const handleCompression = (compInput) => {
    setCompression(compInput);
  };
  const handleMsg = (msg) => {
    console.log(msg);
  };
  return (
    <div>
      <b>Message Queue Length: </b>
      <input
        name="queueInput"
        defaultValue={queue}
        onChange={(event) => handleQueue(event.target.value)}
      />{" "}
      <br />
      <b>Compression: </b>
      <input
        name="compInput"
        defaultValue={compression}
        onChange={(event) => handleCompression(event.target.value)}
      />{" "}
      <br />
      <b>Topic to echo: </b>
      <input
        name="topicInput"
        defaultValue={topic}
        onChange={(event) => handleTopic(event.target.value)}
      />{" "}
      <br />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("container"));
