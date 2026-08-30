"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TripPdf } from "./trip-pdf";

type TripPdfData = {
  title: string;
  destination: string;
  country?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  currency: string;
  summary: string;

  itinerary: {
    day: number;
    date: string;
    title: string;
    activities: {
      time: string;
      title: string;
      description: string;
      location?: string;
      estimatedCost: number;
      category: string;
    }[];
  }[];

  budgetBreakdown: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    miscellaneous: number;
    total: number;
  };

  packingList: {
    item: string;
    category: string;
    essential: boolean;
    checked: boolean;
  }[];
};

export function ExportTripButton({
  trip,
}: {
  trip: TripPdfData;
}) {
  const [pdfError, setPdfError] = useState(false);

  const filename =
    `${trip.title
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()}-trippulse.pdf`;

  if (pdfError) {
    return (
      <Button
        type="button"
        variant="outline"
        size="default"
        onClick={() => {
          setPdfError(false);
          toast.error("PDF generation failed. Please try again.");
        }}
        className="rounded-xl"
      >
        <Download className="size-4" />
        Export PDF
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<TripPdf trip={trip} />}
      fileName={filename}
      onError={() => {
        setPdfError(true);
        toast.error("Failed to generate PDF. Please try again.");
      }}
    >
      {({ loading }) => (
        <Button
          type="button"
          variant="outline"
          size="default"
          disabled={loading}
          className="rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Preparing PDF...
            </>
          ) : (
            <>
              <Download className="size-4" />
              Export PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}