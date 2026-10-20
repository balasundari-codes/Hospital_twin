
import React, { useState } from "react";
import {
  Activity,
  BedDouble,
  Users,
  Clock,
  FlaskConical,
  Play,
  RotateCcw,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function App() {
  const [activePage, setActivePage] = useState("Overview");

  const [arrivals, setArrivals] = useState(18);
  const [staff, setStaff] = useState(6);
  const [beds, setBeds] = useState(24);
  const [labCapacity, setLabCapacity] = useState(12);
  const [result, setResult] = useState(null);

  function runSimulation() {
    const waiting = Math.max(
      5,
      Math.round(15 + arrivals * 1.4 - staff * 2 - labCapacity * 0.4)
    );

    const utilization = Math.min(
      100,
      Math.round((arrivals / beds) * 100 + 35)
    );

    const queue = Math.max(
      0,
      Math.round(arrivals * 1.3 - staff - labCapacity * 0.3)
    );

    setResult({ waiting, utilization, queue });
  }

  function resetSimulation() {
    setArrivals(18);
    setStaff(6);
    setBeds(24);
    setLabCapacity(12);
    setResult(null);
  }

  const metrics = [
    { title: "Patients per hour", value: arrivals, icon: Users },
    { title: "Available beds", value: beds, icon: BedDouble },
    { title: "Clinical staff", value: staff, icon: Stethoscope },
    { title: "Lab capacity / hour", value: labCapacity, icon: FlaskConical }
  ];

  const chartData = [
    {
      name: "Waiting time",
      baseline: 38,
      scenario: result?.waiting ?? 38
    },
    {
      name: "Queue size",
      baseline: 19,
      scenario: result?.queue ?? 19
    },
    {
      name: "Bed utilization",
      baseline: 84,
      scenario: result?.utilization ?? 84
    }
  ];

  function navigate(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSimulator() {
    return (
      <section className="content-grid">
        <section className="card simulator">
          <p className="eyebrow">WHAT-IF ANALYSIS</p>
          <h2>Scenario Simulator</h2>
          <p className="muted">
            Adjust hospital resources to explore possible outcomes.
          </p>

          <div className="control">
            <label>
              Patient arrivals
              <strong>{arrivals} / hour</strong>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              value={arrivals}
              onChange={(e) => setArrivals(Number(e.target.value))}
            />
          </div>

          <div className="control">
            <label>
              Clinical staff
              <strong>{staff} staff</strong>
            </label>
            <input
              type="range"
              min="2"
              max="15"
              value={staff}
              onChange={(e) => setStaff(Number(e.target.value))}
            />
          </div>

          <div className="control">
            <label>
              Treatment beds
              <strong>{beds} beds</strong>
            </label>
            <input
              type="range"
              min="8"
              max="40"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
            />
          </div>

          <div className="control">
            <label>
              Laboratory capacity
              <strong>{labCapacity} / hour</strong>
            </label>
            <input
              type="range"
              min="4"
              max="24"
              value={labCapacity}
              onChange={(e) => setLabCapacity(Number(e.target.value))}
            />
          </div>

          <div className="actions">
            <button className="secondary" onClick={resetSimulation}>
              <RotateCcw size={16} /> Reset
            </button>
            <button className="primary" onClick={runSimulation}>
              <Play size={16} /> Run Simulation
            </button>
          </div>
        </section>

        <section className="card results">
          <p className="eyebrow">SIMULATION OUTPUT</p>
          <h2>Projected Outcomes</h2>

          <div className="result-grid">
            <div className="result">
              <Clock size={20} />
              <p>Average waiting time</p>
              <h2>{result ? `${result.waiting} min` : "38 min"}</h2>
            </div>

            <div className="result">
              <BedDouble size={20} />
              <p>Bed utilization</p>
              <h2>{result ? `${result.utilization}%` : "84%"}</h2>
            </div>

            <div className="result">
              <Users size={20} />
              <p>Estimated queue</p>
              <h2>{result ? result.queue : 19}</h2>
            </div>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="baseline"
                  name="Baseline"
                  fill="#cbd5e1"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="scenario"
                  name="Scenario"
                  fill="#4385ed"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="disclaimer">
            Illustrative estimates using simplified calculations.
            Not validated hospital forecasts.
          </p>
        </section>
      </section>
    );
  }

  function renderDepartments() {
    const departments = [
      {
        name: "Emergency / Triage",
        description: "Initial patient assessment",
        icon: HeartPulse,
        status: "Busy",
        className: "busy"
      },
      {
        name: "Treatment Rooms",
        description: "Clinical care and observation",
        icon: Stethoscope,
        status: "Busy",
        className: "busy"
      },
      {
        name: "Laboratory",
        description: "Diagnostic testing and reports",
        icon: FlaskConical,
        status: "Needs review",
        className: "warning"
      },
      {
        name: "Discharge",
        description: "Patient transition and discharge",
        icon: BedDouble,
        status: "Available",
        className: "available"
      }
    ];

    return (
      <section className="card departments">
        <p className="eyebrow">HOSPITAL FLOW</p>
        <h2>Department Overview</h2>

        <div className="department-grid">
          {departments.map((department) => {
            const Icon = department.icon;

            return (
              <div className="department" key={department.name}>
                <Icon size={24} />
                <h3>{department.name}</h3>
                <p>{department.description}</p>
                <span className={department.className}>
                  {department.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function renderOverview() {
    return (
      <>
        <section className="metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div className="card metric" key={metric.title}>
                <div className="metric-icon">
                  <Icon size={22} />
                </div>
                <p>{metric.title}</p>
                <h2>{metric.value}</h2>
              </div>
            );
          })}
        </section>

        <section className="alert">
          <AlertTriangle size={22} />
          <div>
            <strong>Potential bottleneck detected</strong>
            <p>
              Laboratory processing may delay patient movement
              between treatment and discharge. Test alternative
              configurations using the simulator.
            </p>
          </div>
        </section>

        {renderSimulator()}
        {renderDepartments()}
      </>
    );
  }

  function renderVirtualHospital() {
    return (
      <>
        <section className="alert">
          <HeartPulse size={22} />
          <div>
            <strong>Virtual hospital environment</strong>
            <p>
              Explore the simulated departments and their current
              operational status. All values are demonstration data.
            </p>
          </div>
        </section>

        <section className="metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div className="card metric" key={metric.title}>
                <div className="metric-icon">
                  <Icon size={22} />
                </div>
                <p>{metric.title}</p>
                <h2>{metric.value}</h2>
              </div>
            );
          })}
        </section>

        {renderDepartments()}

        <section className="card simulator">
          <h2>Explore a scenario</h2>
          <p className="muted">
            Change resources and test how the simulated hospital
            may respond.
          </p>
          <button
            className="primary"
            onClick={() => navigate("Scenario Simulator")}
          >
            Open Scenario Simulator <ArrowRight size={16} />
          </button>
        </section>
      </>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <HeartPulse size={30} />
          <h2>HospitalTwin</h2>
        </div>

        <p className="side-label">HOSPITAL OPERATIONS</p>

        <div
          className={`nav ${activePage === "Overview" ? "active" : ""}`}
          onClick={() => navigate("Overview")}
        >
          <Activity size={18} />
          Overview
        </div>

        <div
          className={`nav ${activePage === "Virtual Hospital" ? "active" : ""}`}
          onClick={() => navigate("Virtual Hospital")}
        >
          <Stethoscope size={18} />
          Virtual Hospital
        </div>

        <div
          className={`nav ${activePage === "Scenario Simulator" ? "active" : ""}`}
          onClick={() => navigate("Scenario Simulator")}
        >
          <FlaskConical size={18} />
          Scenario Simulator
        </div>

        <div className="sidebar-note">
          <strong>Simulation mode</strong>
          <p>Explore hospital operations using synthetic data.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="muted">Workspace / </span>
            <strong>{activePage}</strong>
          </div>
          <span className="status">● DEMO ENVIRONMENT</span>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">HOSPITAL INTELLIGENCE PLATFORM</p>
            <h1>
              {activePage === "Overview"
                ? "Hospital Operations Overview"
                : activePage}
            </h1>
            <p className="muted">
              Identify bottlenecks and test operational decisions
              in a virtual hospital.
            </p>
          </div>
        </section>

        {activePage === "Overview" && renderOverview()}

        {activePage === "Virtual Hospital" && renderVirtualHospital()}

        {activePage === "Scenario Simulator" && (
          <>
            {renderSimulator()}
            {renderDepartments()}
          </>
        )}

        <footer>
          HospitalTwin · Frontend prototype · Synthetic data only
        </footer>
      </main>
    </div>
  );
}
