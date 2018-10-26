import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';

import LoadingIndicator from 'components/LoadingIndicator';

const CompanyCardGhost = () => (
  <Card>
    <CardHeader>
      --
    </CardHeader>
    <CardBody className="text-center">
      <LoadingIndicator />
    </CardBody>
  </Card>
);

export default CompanyCardGhost;
