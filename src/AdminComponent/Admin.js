import React from 'react'
import { Tabs,Tab } from 'react-bootstrap'
export default function Admin(props) {
    return (
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="Add Restaurant" title="Add Restaurant">
        </Tab>
        <Tab eventKey="Add Menu" title="Add Menu">
        </Tab>
        <Tab eventKey="Add Location" title="Add Location">
        </Tab>
      </Tabs>
    )
}
