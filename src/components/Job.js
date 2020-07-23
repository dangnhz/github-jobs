import React, { useState } from 'react';
import { Card, Badge, Button, Collapse } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const Job = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className='my-4'>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <div>
            <Card.Title>
              {job.title} -{' '}
              <span className='text-muted font-weight-light'>
                {job.company}
              </span>
            </Card.Title>
            <Card.Subtitle>
              {new Date(job.created_at).toLocaleDateString()} -{' '}
              <span> {job.location}</span>
            </Card.Subtitle>
            <Badge className='mt-2' variant='secondary'>
              {job.type}
            </Badge>
            <div style={{ wordBreak: 'break-all' }} className='mt-2'>
              <ReactMarkdown source={job.how_to_apply} />
            </div>
          </div>
          <a href={job.company_url} rel='noopener noreferrer' target='_blank'>
            <img
              className='d-none d-md-block'
              height='50'
              src={job.company_logo}
              alt={job.company}
            />
          </a>
        </div>
        <Card.Text>
          <Button
            variant='primary'
            className='mt-2'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide Details' : 'View Details'}
          </Button>
        </Card.Text>
        <Collapse in={isOpen}>
          <div className='mt-4'>
            <ReactMarkdown source={job.description} />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default Job;
