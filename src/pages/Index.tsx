import { useEffect, useState } from "react";
import { JobData, parseCSV, getTopSkills, getSalaryByExperience, getIndustryDistribution, calculateAverageSalary } from "@/lib/dataParser";
import { StatCard } from "@/components/StatCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SalaryChart } from "@/components/SalaryChart";
import { SkillsChart } from "@/components/SkillsChart";
import { IndustryChart } from "@/components/IndustryChart";
import { RemoteDistribution } from "@/components/RemoteDistribution";
import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [filteredData, setFilteredData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    experienceLevel: 'all',
    location: 'all',
    industry: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobData = await parseCSV();
        setData(jobData);
        setFilteredData(jobData);
        setLoading(false);
        toast.success(`Loaded ${jobData.length.toLocaleString()} job listings`);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load job data');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...data];
    
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => job.experience_level === filters.experienceLevel);
    }
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.company_location === filters.location);
    }
    if (filters.industry !== 'all') {
      filtered = filtered.filter(job => job.industry === filters.industry);
    }
    
    setFilteredData(filtered);
  }, [filters, data]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      experienceLevel: 'all',
      location: 'all',
      industry: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI job market data...</p>
        </div>
      </div>
    );
  }

  const avgSalary = calculateAverageSalary(filteredData);
  const topSkills = getTopSkills(filteredData, 10);
  const salaryByExperience = getSalaryByExperience(filteredData);
  const industryDistribution = getIndustryDistribution(filteredData, 8);
  const remoteJobs = filteredData.filter(job => job.remote_ratio === 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-3">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">AI Job Market Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Analyzing {filteredData.length.toLocaleString()} of {data.length.toLocaleString()} jobs
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <FilterPanel
              data={data}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Jobs"
                value={filteredData.length.toLocaleString()}
                icon={Briefcase}
              />
              <StatCard
                title="Avg Salary"
                value={`$${(avgSalary / 1000).toFixed(0)}k`}
                icon={DollarSign}
              />
              <StatCard
                title="Remote Jobs"
                value={`${Math.round((remoteJobs / filteredData.length) * 100)}%`}
                icon={Users}
              />
              <StatCard
                title="Top Skill"
                value={topSkills[0]?.skill || 'N/A'}
                icon={TrendingUp}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalaryChart data={salaryByExperience} />
              <RemoteDistribution data={filteredData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillsChart data={topSkills} />
              <IndustryChart data={industryDistribution} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
