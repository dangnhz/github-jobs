import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import useFetchJobs from './hooks/useFetchJobs';
import Job from './components/Job';
import JobsPagination from './components/JobsPagination';
import SearchForm from './components/SearchForm';
import LoadingSpinner from './components/LoadingSpinner';
// import jobs from './jobs.json';

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, isLoading, error, hasNextPage } = useFetchJobs(params, page);

  function handleParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams((prevParams) => {
      return { ...prevParams, [param]: value };
    });
  }

  return (
    <Container className='my-4'>
      <h1 className='my-2'>Github Jobs</h1>

      <SearchForm params={params} onParamChange={handleParamChange} />

      <div className='main'>
        {isLoading && <LoadingSpinner />}

        {error && <h3 className='text-center'>Error. Try to refresh again</h3>}
        {jobs?.length > 0 && (
          <JobsPagination
            setPage={setPage}
            page={page}
            hasNextPage={hasNextPage}
          />
        )}

        {jobs.map((job) => (
          <Job key={job.id} job={job} />
        ))}
        {jobs?.length > 0 && (
          <JobsPagination
            setPage={setPage}
            page={page}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
    </Container>
  );
}

export default App;
