"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";

// Assuming papers data is imported from an external file
import { papers as papersData } from "./calls";

export default function Component() {
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [papers] = useState(papersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [journalSearch, setJournalSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 50;

  const journals = Array.from(new Set(papers.map((paper) => paper.journal)));
  const filteredJournals = journalSearch
    ? journals.filter((journal) =>
        journal.toLowerCase().includes(journalSearch.toLowerCase())
      )
    : journals;

  const handleSearch = () => {
    setIsLoading(true);
    let filtered = papers.filter((paper) => {
      if (
        selectedJournals.length > 0 &&
        !selectedJournals.includes(paper.journal)
      ) {
        return false;
      }
      if (deadline) {
        const paperDate = new Date(paper.dueDate || paper.gracePeriod || "");
        const now = new Date();
        const diffMonths =
          (paperDate.getFullYear() - now.getFullYear()) * 12 +
          paperDate.getMonth() -
          now.getMonth();
        if (deadline === "1-month" && diffMonths > 1) return false;
        if (deadline === "3-months" && diffMonths > 3) return false;
        if (deadline === "6-months" && diffMonths > 6) return false;
      }
      if (activeStatus && paper.active.toString() !== activeStatus) {
        return false;
      }
      if (
        searchQuery &&
        !paper.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "deadline") {
        const dateA = new Date(
          a.dueDate || a.gracePeriod || Date.now() + 1000000000
        );
        const dateB = new Date(
          b.dueDate || b.gracePeriod || Date.now() + 1000000000
        );
        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "journal") {
        return sortOrder === "asc"
          ? a.journal.localeCompare(b.journal)
          : b.journal.localeCompare(a.journal);
      }
      return 0;
    });

    setFilteredPapers(filtered);
    setCurrentPage(1);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedJournals, deadline, activeStatus, papers, sortBy, sortOrder]);

  const getDeadlineColor = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffMonths =
      (date.getFullYear() - now.getFullYear()) * 12 +
      date.getMonth() -
      now.getMonth();
    if (diffMonths <= 1) return "bg-red-100 text-red-800";
    if (diffMonths <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getActiveStatusColor = (active) => {
    return active ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
        <p className="mt-4 text-gray-600">Loading papers...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Research Paper Calls - Currently {papers.length} calls across{" "}
          {journals.length} journals
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`lg:w-1/4 space-y-6 bg-white p-6 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
              isFilterOpen ? "h-auto" : "h-20 overflow-hidden"
            } lg:h-[80vh] lg:overflow-visible`}
          >
            <div className="flex justify-between items-center lg:hidden">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="hidden lg:block overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Filters
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Journals ({filteredJournals.length})
                  </Label>
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search journals..."
                      className="mb-2"
                      value={journalSearch}
                      onChange={(e) => setJournalSearch(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[60vh]">
                    {filteredJournals.map((journal) => (
                      <div
                        key={journal}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          id={journal}
                          checked={selectedJournals.includes(journal)}
                          onCheckedChange={(checked) => {
                            setSelectedJournals(
                              checked
                                ? [...selectedJournals, journal]
                                : selectedJournals.filter((c) => c !== journal)
                            );
                          }}
                        />
                        <label
                          htmlFor={journal}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {journal}
                        </label>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </aside>
          <div className="w-full lg:w-3/4 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  className="flex-1"
                  placeholder="Search for research paper calls..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {currentPapers.map((paper, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{paper.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {paper.journal}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getActiveStatusColor(
                          paper.active
                        )}`}
                      >
                        {paper.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${getDeadlineColor(
                          paper.dueDate ||
                            paper.gracePeriod ||
                            (Date.now() + 1000000000).toString()
                        )}`}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(
                          paper.dueDate ||
                            paper.gracePeriod ||
                            Date.now() + 1000000000
                        ).toLocaleDateString()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(paper.url, "_blank")}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredPapers.length === 0 && (
                <p className="text-center text-gray-500 col-span-2">
                  No matching research papers found.
                </p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
