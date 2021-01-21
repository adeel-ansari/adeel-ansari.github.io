import React from 'react';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import './StrategyGridView.css' ;

const StrategyGridView = () => {

    const class_dict = {
        "strategy": [
            {
                "Property": "Strategy.coreCapability",
                "Property Type": "ObjectProperty",
                "Target Class": "CoreCapability"
            },
            {
                "Property": "Strategy.title",
                "Property Type": "DatatypeProperty",
                "Target Class": "string"
            },
            {
                "Property": "Strategy.managementSystem",
                "Property Type": "ObjectProperty",
                "Target Class": "ManagementSystem"
            },
            {
                "Property": "Strategy.whereToPlay",
                "Property Type": "ObjectProperty",
                "Target Class": "WhereToPlay"
            },
            {
                "Property": "Strategy.startDate",
                "Property Type": "DatatypeProperty",
                "Target Class": "dateTime"
            },
            {
                "Property": "Strategy.howToWin",
                "Property Type": "ObjectProperty",
                "Target Class": "HowToWin"
            },
            {
                "Property": "Strategy.endDate",
                "Property Type": "DatatypeProperty",
                "Target Class": "dateTime"
            },
            {
                "Property": "Strategy.winningAspiration",
                "Property Type": "ObjectProperty",
                "Target Class": "WinningAspiration"
            }
        ],
        "WhereToPlay": [
            {
                "Property": "WhereToPlay.distributionChannel",
                "Property Type": "ObjectProperty",
                "Target Class": "DistributionChannel"
            },
            {
                "Property": "WhereToPlay.productType",
                "Property Type": "ObjectProperty",
                "Target Class": "ProductType"
            },
            {
                "Property": "WhereToPlay.geography",
                "Property Type": "ObjectProperty",
                "Target Class": "Geography"
            },
            {
                "Property": "WhereToPlay.verticalStageOfProduction",
                "Property Type": "ObjectProperty",
                "Target Class": "VerticalStageOfProduction"
            },
            {
                "Property": "WhereToPlay.consumerSegment",
                "Property Type": "ObjectProperty",
                "Target Class": "ConsumerSegment"
            }
        ],
        "Consumer": [
            {
                "Property": "Consumer.consumerSegment",
                "Property Type": "ObjectProperty",
                "Target Class": "ConsumerSegment"
            }
        ],
        "CoreCapability": [
            {
                "Property": "CoreCapability.reinforcingRod",
                "Property Type": "ObjectProperty",
                "Target Class": "CoreCapability"
            },
            {
                "Property": "CoreCapability.reinforcingRelationship",
                "Property Type": "ObjectProperty",
                "Target Class": "CoreCapability"
            },
            {
                "Property": "CoreCapability.supportingActivity",
                "Property Type": "ObjectProperty",
                "Target Class": "Activity"
            }
        ],
        "Organization": [
            {
                "Property": "Organization.strategy",
                "Property Type": "ObjectProperty",
                "Target Class": "strategy"
            },
            {
                "Property": "Organization.activitySystem",
                "Property Type": "ObjectProperty",
                "Target Class": "ActivitySystem"
            }
        ],
        "ActivitySystem": [
            {
                "Property": "ActivitySystem.coreCapability",
                "Property Type": "ObjectProperty",
                "Target Class": "CoreCapability"
            }
        ],
        "Customer": [
            {
                "Property": "Customer.customerSegment",
                "Property Type": "ObjectProperty",
                "Target Class": "CustomerSegment"
            }
        ],
        "WinningAspiration": [
            {
                "Property": "WinningAspiration.AspirationStatement",
                "Property Type": "DatatypeProperty",
                "Target Class": "string"
            },
            {
                "Property": "WinningAspiration.competitorContext",
                "Property Type": "ObjectProperty",
                "Target Class": "Competitor"
            },
            {
                "Property": "WinningAspiration.consumerContext",
                "Property Type": "ObjectProperty",
                "Target Class": "ConsumerSegment"
            }
        ]
    }
    
    return (
        Object.keys(class_dict).map((key, index) => {
            return (
                <>
                    <h3>
                        {key}
                    </h3>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Attribute Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                class_dict[key].map((class_attr) => {
                                    return (
                                        <tr>
                                            {class_attr['Property']}
                                        </tr>)
                                })
                            }
                        </tbody>
                    </Table>
                    <br />
                </>
            )
        })
    );
};

export default StrategyGridView;