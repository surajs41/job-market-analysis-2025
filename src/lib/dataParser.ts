export interface JobData {
  job_id: string;
  job_title: string;
  salary_usd: number;
  salary_currency: string;
  experience_level: string;
  employment_type: string;
  company_location: string;
  company_size: string;
  employee_residence: string;
  remote_ratio: number;
  required_skills: string;
  education_required: string;
  years_experience: number;
  industry: string;
  posting_date: string;
  application_deadline: string;
  job_description_length: number;
  benefits_score: number;
  company_name: string;
}

export const parseCSV = async (): Promise<JobData[]> => {
  const response = await fetch('/data/ai_job_dataset.csv');
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  const headers = lines[0].split(',');
  const data: JobData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const job: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        if (['salary_usd', 'remote_ratio', 'years_experience', 'job_description_length', 'benefits_score'].includes(header)) {
          job[header] = parseFloat(value) || 0;
        } else {
          job[header] = value;
        }
      });
      data.push(job as JobData);
    }
  }
  
  return data;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
};

export const getUniqueValues = (data: JobData[], key: keyof JobData): string[] => {
  const values = data.map(item => String(item[key]));
  return Array.from(new Set(values)).sort();
};

export const calculateAverageSalary = (data: JobData[]): number => {
  const total = data.reduce((sum, job) => sum + job.salary_usd, 0);
  return Math.round(total / data.length);
};

export const getTopSkills = (data: JobData[], limit: number = 10): { skill: string; count: number; avgSalary: number }[] => {
  const skillMap = new Map<string, { count: number; totalSalary: number }>();
  
  data.forEach(job => {
    const skills = job.required_skills.split(',').map(s => s.trim());
    skills.forEach(skill => {
      const existing = skillMap.get(skill) || { count: 0, totalSalary: 0 };
      skillMap.set(skill, {
        count: existing.count + 1,
        totalSalary: existing.totalSalary + job.salary_usd
      });
    });
  });
  
  return Array.from(skillMap.entries())
    .map(([skill, data]) => ({
      skill,
      count: data.count,
      avgSalary: Math.round(data.totalSalary / data.count)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getExperienceLevelDistribution = (data: JobData[]) => {
  const distribution = new Map<string, number>();
  data.forEach(job => {
    const level = job.experience_level;
    distribution.set(level, (distribution.get(level) || 0) + 1);
  });
  
  const labels: Record<string, string> = {
    'EN': 'Entry Level',
    'MI': 'Mid Level',
    'SE': 'Senior',
    'EX': 'Executive'
  };
  
  return Array.from(distribution.entries())
    .map(([level, count]) => ({
      level: labels[level] || level,
      count,
      percentage: Math.round((count / data.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
};

export const getIndustryDistribution = (data: JobData[], limit: number = 8) => {
  const distribution = new Map<string, { count: number; totalSalary: number }>();
  
  data.forEach(job => {
    const existing = distribution.get(job.industry) || { count: 0, totalSalary: 0 };
    distribution.set(job.industry, {
      count: existing.count + 1,
      totalSalary: existing.totalSalary + job.salary_usd
    });
  });
  
  return Array.from(distribution.entries())
    .map(([industry, data]) => ({
      industry,
      count: data.count,
      avgSalary: Math.round(data.totalSalary / data.count)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getSalaryByExperience = (data: JobData[]) => {
  const distribution = new Map<string, number[]>();
  
  data.forEach(job => {
    const salaries = distribution.get(job.experience_level) || [];
    salaries.push(job.salary_usd);
    distribution.set(job.experience_level, salaries);
  });
  
  const labels: Record<string, string> = {
    'EN': 'Entry Level',
    'MI': 'Mid Level',
    'SE': 'Senior',
    'EX': 'Executive'
  };
  
  return Array.from(distribution.entries())
    .map(([level, salaries]) => ({
      level: labels[level] || level,
      avgSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      minSalary: Math.min(...salaries),
      maxSalary: Math.max(...salaries)
    }))
    .sort((a, b) => {
      const order = ['Entry Level', 'Mid Level', 'Senior', 'Executive'];
      return order.indexOf(a.level) - order.indexOf(b.level);
    });
};

export const getUniqueCompanies = (data: JobData[]): number => {
  return new Set(data.map(job => job.company_name)).size;
};

export const getUniqueLocations = (data: JobData[]): number => {
  return new Set(data.map(job => job.company_location)).size;
};

export const getUniqueIndustries = (data: JobData[]): number => {
  return new Set(data.map(job => job.industry)).size;
};

export const getEducationDistribution = (data: JobData[]) => {
  const distribution = new Map<string, number>();
  data.forEach(job => {
    const edu = job.education_required;
    distribution.set(edu, (distribution.get(edu) || 0) + 1);
  });
  
  return Array.from(distribution.entries())
    .map(([education, count]) => ({
      education,
      count,
      percentage: Math.round((count / data.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);
};
