import { useState } from 'react';
import { Job, ViewMode } from './types';
import { TEAM_MEMBERS } from './data/mockData';
import { useJobs } from './hooks/useJobs';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { WeeklyBoard } from './components/WeeklyBoard';
import { JobModal } from './components/JobModal';
import { AddJobForm } from './components/AddJobForm';

function App() {
  const {
    jobs,
    filteredJobs,
    weekJobs,
    currentWeekStart,
    selectedAssignees,
    searchQuery,
    statusFilter,
    priorityFilter,
    addJob,
    updateJob,
    deleteJob,
    nextWeek,
    prevWeek,
    toggleAssignee,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
  } = useJobs();

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleView = () => setViewMode((v) => (v === 'week' ? 'person' : 'week'));

  const handleClearAssignees = () => {
    selectedAssignees.slice().forEach((id) => toggleAssignee(id));
  };

  const displayJobs = viewMode === 'person' ? filteredJobs : weekJobs;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentWeekStart={currentWeekStart}
        viewMode={viewMode}
        selectedAssignees={selectedAssignees}
        members={TEAM_MEMBERS}
        onPrevWeek={prevWeek}
        onNextWeek={nextWeek}
        onToggleView={handleToggleView}
        onToggleAssignee={toggleAssignee}
        onClearAssignees={handleClearAssignees}
        onAddJob={() => setShowAddForm(true)}
      />

      <FilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <main className="flex-1 overflow-auto">
        <WeeklyBoard
          jobs={displayJobs}
          allJobs={jobs}
          members={TEAM_MEMBERS}
          viewMode={viewMode}
          currentWeekStart={currentWeekStart}
          onJobClick={(job) => setSelectedJob(job)}
        />
      </main>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          members={TEAM_MEMBERS}
          onClose={() => setSelectedJob(null)}
          onUpdate={updateJob}
          onDelete={deleteJob}
        />
      )}

      {showAddForm && (
        <AddJobForm
          members={TEAM_MEMBERS}
          onClose={() => setShowAddForm(false)}
          onAdd={addJob}
        />
      )}
    </div>
  );
}

export default App;
