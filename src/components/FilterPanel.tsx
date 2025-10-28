import { JobData } from "@/lib/dataParser";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  data: JobData[];
  filters: {
    experienceLevel: string;
    location: string;
    industry: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export const FilterPanel = ({ data, filters, onFilterChange, onReset }: FilterPanelProps) => {
  const experienceLevels = Array.from(new Set(data.map(d => d.experience_level))).sort();
  const locations = Array.from(new Set(data.map(d => d.company_location))).sort();
  const industries = Array.from(new Set(data.map(d => d.industry))).sort();

  const experienceLabels: Record<string, string> = {
    'EN': 'Entry Level',
    'MI': 'Mid Level',
    'SE': 'Senior',
    'EX': 'Executive'
  };

  const hasActiveFilters = filters.experienceLevel !== 'all' || 
                          filters.location !== 'all' || 
                          filters.industry !== 'all';

  return (
    <div className="stat-card space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm font-medium">
            Experience Level
          </Label>
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) => onFilterChange('experienceLevel', value)}
          >
            <SelectTrigger id="experience">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {experienceLevels.map(level => (
                <SelectItem key={level} value={level}>
                  {experienceLabels[level] || level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange('location', value)}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium">
            Industry
          </Label>
          <Select
            value={filters.industry}
            onValueChange={(value) => onFilterChange('industry', value)}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
