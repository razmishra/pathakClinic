import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCard = (props) => {
  const { cardTitle, cardImage: CardImage, cardDescription } = props;
  const borderColors = ["red", "blue", "green", "orange", "purple", "pink", "black"];
  const borderColor =
    borderColors[Math.floor(Math.random() * borderColors.length)];

  return (
    <Card
      className="w-full flex items-center justify-around hover:shadow-lg border-l-2"
      style={{ borderColor, borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}
    >
      <div>
        <CardHeader>
          <CardTitle className="font-medium">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>{cardDescription}</CardContent>
      </div>
      <div className="mr-2 ">{CardImage && <CardImage size={30} />}</div>
    </Card>
  );
};

export default DashboardCard;
