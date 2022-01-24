import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function Popup(props) {
  return (
    <Modal centered {...props} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Important</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Gotcha!!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
