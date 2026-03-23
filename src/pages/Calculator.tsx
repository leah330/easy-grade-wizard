import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calculator, UserPlus, Users, Settings, ClipboardList, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Student {
  name: string;
  marks: number[];
  total: number;
  mean: number;
  grade: string;
}

const SUBJECTS = ["Mathematics", "English", "Chemistry", "Biology", "Physics", "History"];

function getGrade(mean: number): string {
  if (mean >= 70) return "A";
  if (mean >= 60) return "B";
  if (mean >= 50) return "C";
  if (mean >= 40) return "D";
  return "E";
}

function gradeColor(grade: string) {
  const map: Record<string, string> = {
    A: "bg-primary text-primary-foreground",
    B: "bg-accent text-accent-foreground",
    C: "bg-secondary text-secondary-foreground",
    D: "bg-muted text-muted-foreground",
    E: "bg-destructive text-destructive-foreground",
  };
  return map[grade] ?? "";
}

type Tab = "entry" | "records" | "settings";

const Calculator_Page = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("entry");
  const [name, setName] = useState("");
  const [marks, setMarks] = useState<string[]>(["", "", "", "", "", ""]);
  const [result, setResult] = useState<{ total: number; mean: number; grade: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentNumber, setStudentNumber] = useState(1);
  const [showClassStats, setShowClassStats] = useState(false);

  // Settings
  const [className, setClassName] = useState("Form 1");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const handleMark = (i: number, v: string) => {
    const next = [...marks];
    next[i] = v;
    setMarks(next);
  };

  const calculate = () => {
    const nums = marks.map((m) => Number(m) || 0);
    const total = nums.reduce((a, b) => a + b, 0);
    const mean = total / nums.length;
    setResult({ total, mean: parseFloat(mean.toFixed(2)), grade: getGrade(mean) });
  };

  const addStudentAndNext = () => {
    if (!name.trim() || !result) return;
    const nums = marks.map((m) => Number(m) || 0);
    setStudents((prev) => [...prev, { name: name.trim(), marks: nums, ...result }]);
    setName("");
    setMarks(["", "", "", "", "", ""]);
    setResult(null);
    setStudentNumber((n) => n + 1);
    setShowClassStats(false);
  };

  const classTotal = students.reduce((s, st) => s + st.total, 0);
  const classMean = students.length ? parseFloat((classTotal / (students.length * SUBJECTS.length)).toFixed(2)) : 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "entry", label: "Mark Entry", icon: <Calculator className="h-4 w-4" /> },
    { id: "records", label: "Student Records", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Easy Grade System</h1>
            <p className="text-xs text-muted-foreground">{className} &middot; {term} &middot; {year}</p>
          </div>
        </div>
      </header>

      {/* Dashboard tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
              {t.id === "records" && students.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {students.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-primary" /> Class Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div>
                <Label>Class Name</Label>
                <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Form 1" />
              </div>
              <div>
                <Label>Term</Label>
                <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. Term 1" />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2026" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── MARK ENTRY TAB ── */}
        {activeTab === "entry" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="h-5 w-5 text-primary" />
                Student #{studentNumber} — Enter Marks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Student Name</Label>
                <Input placeholder="e.g. Leah" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SUBJECTS.map((s, i) => (
                  <div key={s}>
                    <Label>{s}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0 – 100"
                      value={marks[i]}
                      onChange={(e) => handleMark(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={calculate} className="gap-2">
                  <Calculator className="h-4 w-4" /> Calculate
                </Button>
                <Button
                  onClick={addStudentAndNext}
                  variant="secondary"
                  disabled={!result || !name.trim()}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" /> Save & Next Student
                </Button>
              </div>

              {result && (
                <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-border bg-muted/50 p-4 text-sm">
                  <span><strong>Total:</strong> {result.total}</span>
                  <span><strong>Mean:</strong> {result.mean}</span>
                  <span className="flex items-center gap-1">
                    <strong>Grade:</strong>
                    <Badge className={gradeColor(result.grade)}>{result.grade}</Badge>
                  </span>
                </div>
              )}

              {result && name.trim() && (
                <p className="text-sm text-muted-foreground">
                  Click <strong>"Save & Next Student"</strong> to save and move to Student #{studentNumber + 1}.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── RECORDS TAB ── */}
        {activeTab === "records" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Student Records
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {className} &middot; {term} &middot; {year}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p>No students added yet.</p>
                  <p className="text-sm">Go to <strong>Mark Entry</strong> to add students.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Student Name</TableHead>
                          {SUBJECTS.map((s) => (
                            <TableHead key={s} className="text-center text-xs">{s}</TableHead>
                          ))}
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Mean</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((st, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                            <TableCell className="font-medium">{st.name}</TableCell>
                            {st.marks.map((m, j) => (
                              <TableCell key={j} className="text-center">{m}</TableCell>
                            ))}
                            <TableCell className="text-right font-semibold">{st.total}</TableCell>
                            <TableCell className="text-right">{st.mean}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={gradeColor(st.grade)}>{st.grade}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Calculate Class Mean button */}
                  <div className="mt-6 flex justify-center">
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={() => setShowClassStats(true)}
                    >
                      <BarChart3 className="h-5 w-5" /> Calculate Class Mean
                    </Button>
                  </div>

                  {showClassStats && (
                    <div className="mt-4 flex flex-wrap gap-6 rounded-lg border border-border bg-primary/5 p-5 text-sm font-medium animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                      <span>Total Students: <strong>{students.length}</strong></span>
                      <span>Class Total Marks: <strong>{classTotal}</strong></span>
                      <span>Class Mean: <strong>{classMean}</strong></span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calculator_Page;
