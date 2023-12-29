// src/components/LandingPage.js
import React, {useEffect, useContext} from 'react';
import { Carousel, Card, Row, Col, Container } from 'react-bootstrap';
import carImage from '../images/Car.png';
import motorcycleImage from '../images/bike.png';
import carThreeImage from '../images/carThree.png';
import carouselOne from '../images/carousel_1.png'
import carouselTwo from '../images/carousel_2.png'
import carouselThree from '../images/carousel_3.png'
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../App";


const LandingPage = () => {
    // Placeholder data
    const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  
    const vehicles = [
        { id: 1, name: "Car", image: carouselTwo, description: "Car in the parking lot." },
        { id: 2, name: "Bike", image: carouselOne, description: "Bike parked securely." },
        { id: 3, name: "Car", image: carouselThree, description: "Car in a dedicated spot." },
    ];

    const services = [
        { 
            id: 1, 
            title: "24/7 Security", 
            description: "Round-the-clock surveillance and security to keep your vehicle safe.", 
            image: carImage 
        },
        { 
            id: 2, 
            title: "Bike Facility", 
            description: "Dedicated parking areas equipped with bike-friendly features.", 
            image: motorcycleImage 
        },
        { 
            id: 3, 
            title: "24/7 Availability", 
            description: "Convenient and accessible parking available at any time, day or night.", 
            image: carThreeImage 
        }
        
        // Add more services...
    ];

    useEffect(() => {
        if(state) {
          navigate("/viewVehicle")
        }
      }, [state])

    return (
        <div>
            
            <Carousel>
            
                {vehicles.map(vehicle => (
                    <Carousel.Item key={vehicle.id}>
                        <img className="d-block w-100" src={vehicle.image} alt={vehicle.name} style={{ height: '700px', objectFit: 'cover' }} />
                        <Carousel.Caption>
                            <h1>{vehicle.name}</h1>
                            <h4>{vehicle.description}</h4>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Services Section */}
            <h1 className='text-center mt-5' >Services We Offer</h1>
            <Container className="my-5">
                <Row>
                    {services.map(service => (
                        <Col md={4} key={service.id}>
                            <Card className="mb-4">
                                <Card.Img variant="top" src={service.image} />
                                <Card.Body>
                                    <Card.Title>{service.title}</Card.Title>
                                    <Card.Text>{service.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Footer */}
            <footer style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
                <p>© 2023 Vehicle Parking Service. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
