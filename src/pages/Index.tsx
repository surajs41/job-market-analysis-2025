import { useEffect, useState } from "react";
import { JobData, parseCSV, getTopSkills, getSalaryByExperience, getIndustryDistribution, calculateAverageSalary, getUniqueCompanies, getUniqueLocations, getUniqueIndustries, getEducationDistribution } from "@/lib/dataParser";
import { StatCard } from "@/components/StatCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SalaryChart } from "@/components/SalaryChart";
import { SkillsChart } from "@/components/SkillsChart";
import { IndustryChart } from "@/components/IndustryChart";
import { RemoteDistribution } from "@/components/RemoteDistribution";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Briefcase, DollarSign, TrendingUp, Users, Building2, MapPin, GraduationCap, Factory } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [filteredData, setFilteredData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    experienceLevel: 'all',
    location: 'all',
    industry: 'all',
    role: 'all'
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
    if (filters.role !== 'all') {
      filtered = filtered.filter(job => job.job_title === filters.role);
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
      industry: 'all',
      role: 'all'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4 shadow-[var(--shadow-glow)]"></div>
          <p className="text-muted-foreground text-lg">Loading AI job market data...</p>
        </div>
      </div>
    );
  }

  const avgSalary = calculateAverageSalary(filteredData);
  const topSkills = getTopSkills(filteredData, 10);
  const salaryByExperience = getSalaryByExperience(filteredData);
  const industryDistribution = getIndustryDistribution(filteredData, 8);
  const remoteJobs = filteredData.filter(job => job.remote_ratio === 100).length;
  const uniqueCompanies = getUniqueCompanies(filteredData);
  const uniqueLocations = getUniqueLocations(filteredData);
  const uniqueIndustries = getUniqueIndustries(filteredData);
  const educationDist = getEducationDistribution(filteredData);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="glass-effect border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-3 shadow-lg animate-pulse-glow">
                <TrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">AI Job Market Analytics</h1>
                <p className="text-sm text-muted-foreground">
                  Analyzing <span className="text-primary font-semibold">{filteredData.length.toLocaleString()}</span> of <span className="font-semibold">{data.length.toLocaleString()}</span> jobs
                </p>
              </div>
            </div>
            <ThemeToggle />
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
                title="Companies"
                value={uniqueCompanies.toLocaleString()}
                icon={Building2}
              />
              <StatCard
                title="Locations"
                value={uniqueLocations.toLocaleString()}
                icon={MapPin}
              />
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Industries"
                value={uniqueIndustries.toLocaleString()}
                icon={Factory}
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
              <StatCard
                title="Top Education"
                value={educationDist[0]?.education || 'N/A'}
                icon={GraduationCap}
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
