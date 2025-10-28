import { JobData } from "@/lib/dataParser";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterPanelProps {
  data: JobData[];
  filters: {
    experienceLevel: string;
    location: string;
    industry: string;
    role: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export const FilterPanel = ({ data, filters, onFilterChange, onReset }: FilterPanelProps) => {
  const [roleOpen, setRoleOpen] = useState(false);
  
  const experienceLevels = Array.from(new Set(data.map(d => d.experience_level))).sort();
  const locations = Array.from(new Set(data.map(d => d.company_location))).sort();
  const industries = Array.from(new Set(data.map(d => d.industry))).sort();
  const roles = Array.from(new Set(data.map(d => d.job_title))).sort();

  const experienceLabels: Record<string, string> = {
    'EN': 'Entry Level',
    'MI': 'Mid Level',
    'SE': 'Senior',
    'EX': 'Executive'
  };

  const hasActiveFilters = filters.experienceLevel !== 'all' || 
                          filters.location !== 'all' || 
                          filters.industry !== 'all' ||
                          filters.role !== 'all';

  return (
    <div className="stat-card-3d space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 px-2 hover:bg-primary/10">
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Role Search */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">
            Job Role
          </Label>
          <Popover open={roleOpen} onOpenChange={setRoleOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={roleOpen}
                className="w-full justify-between bg-background/50 hover:bg-background/80"
              >
                {filters.role !== 'all'
                  ? roles.find((role) => role === filters.role)
                  : "All Roles"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search role..." />
                <CommandList>
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        onFilterChange('role', 'all');
                        setRoleOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.role === 'all' ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Roles
                    </CommandItem>
                    {roles.map((role) => (
                      <CommandItem
                        key={role}
                        value={role}
                        onSelect={(currentValue) => {
                          onFilterChange('role', currentValue);
                          setRoleOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.role === role ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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
