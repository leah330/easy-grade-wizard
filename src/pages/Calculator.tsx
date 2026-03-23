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
import { ArrowLeft, Calculator, UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Student {
  name: string;
  marks: number[];
  total: number;
  mean: number;
  grade: string;
}

const SUBJECTS = ["Subject 1", "Subject 2", "Subject 3", "Subject 4"];

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

const Calculator_Page = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [marks, setMarks] = useState<string[]>(["", "", "", ""]);
  const [result, setResult] = useState<{ total: number; mean: number; grade: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

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

  const addStudent = () => {
    if (!name.trim() || !result) return;
    const nums = marks.map((m) => Number(m) || 0);
    setStudents((prev) => [...prev, { name: name.trim(), marks: nums, ...result }]);
    setName("");
    setMarks(["", "", "", ""]);
    setResult(null);
  };

  const classTotal = students.reduce((s, st) => s + st.total, 0);
  const classMean = students.length ? parseFloat((classTotal / students.length).toFixed(2)) : 0;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Student Marks Calculator</h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" /> Enter Marks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Student Name</Label>
              <Input placeholder="e.g. Leah" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <Button onClick={addStudent} variant="secondary" disabled={!result || !name.trim()} className="gap-2">
                <UserPlus className="h-4 w-4" /> Add Student
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
          </CardContent>
        </Card>

        {/* Students Table */}
        {students.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" /> Student Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Student Name</TableHead>
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
                        <TableCell className="text-right">{st.total}</TableCell>
                        <TableCell className="text-right">{st.mean}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={gradeColor(st.grade)}>{st.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Class stats */}
              <div className="mt-6 flex flex-wrap gap-6 rounded-lg border border-border bg-primary/5 p-4 text-sm font-medium">
                <span>Class Total: <strong>{classTotal}</strong></span>
                <span>Class Mean: <strong>{classMean}</strong></span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Calculator_Page;
