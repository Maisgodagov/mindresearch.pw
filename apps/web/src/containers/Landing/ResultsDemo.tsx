import { useState } from "react";
import { Info } from "lucide-react";
import { RespondentResults } from "../SurveyDashboard/components/RespondentResults";
import { RespondentDetails } from "../SurveyDashboard/components/RespondentDetails";
import { MethodScoreSummary } from "../SurveyDashboard/components/MethodScoreSummary";
import { MethodologyInterpretation } from "../SurveyDashboard/components/MethodologyInterpretation";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import { demoMethodologies } from "./demoData";
import { resultDemoPeople, resultDemoQualities } from "./resultsDemoData";
const first = resultDemoPeople[0];
export function ResultsDemo() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
      [first.id]: true,
    }),
    [selected, setSelected] = useState<Record<string, boolean>>({}),
    [methodology, setMethodology] = useState<Methodology | null>(null);
  const [sort, setSort] = useState({
    key: "newest",
    direction: "asc" as "asc" | "desc",
  });
  const people = [...resultDemoPeople].sort((a, b) => {
    let comparison = 0;
    if (sort.key === "overall") comparison=(resultDemoQualities[a.id].overall.score??0)-(resultDemoQualities[b.id].overall.score??0);
    else if (sort.key === "alias") comparison = a.alias.localeCompare(b.alias, "ru");
    else if (sort.key === "age") comparison = (a.age ?? 0) - (b.age ?? 0);
    else if (sort.key === "started")
      comparison = a.startedAt.localeCompare(b.startedAt);
    else if (sort.key.startsWith("method:")) {
      const code = decodeURIComponent(sort.key.split(":")[1]);
      const value = (p: typeof a) => {
        const v = p.groups.find((g) => g.code === code)!.result?.values;
        if (!v) return null;
        return Number(
          code === "test_1" ? (v.overall as { score: number }).score : v.score,
        );
      };
      const av=value(a),bv=value(b);
        if(av===null)return bv===null?0:1;
        if(bv===null)return -1;
        comparison = av - bv;
    }
    return comparison * (sort.direction === "asc" ? 1 : -1);
  });
  const selectedCount = Object.values(selected).filter(Boolean).length;
  return (
    <div className="landing-results-demo">
      <RespondentResults
        storageKey="mindresearch:landing:fictional-results:v1"
        showToolbarActions={false}
        includeQualityRow={false}
        initialMethodExpanded={{ [JSON.stringify([first.id, "test_1"])]: true }}
        sortKey={sort.key}
        sortDirection={sort.direction}
        methodSortOptions={first.groups.map((g) => ({
          value: `method:${encodeURIComponent(g.code)}:score`,
          label: g.title,
        }))}
        onColumnSort={(key, direction) => setSort({ key, direction })}
        readOnly
        showAge
        onSortAge={() =>
          setSort({
            key: "age",
            direction:
              sort.key === "age" && sort.direction === "asc" ? "desc" : "asc",
          })
        }
        ageSortDirection={sort.key === "age" ? sort.direction : undefined}
        respondents={people}
        totalCount={6}
        qualities={resultDemoQualities}
        deletedRespondents={[]}
        sections={first.groups.map((g) => ({
          code: g.code,
          title: g.title,
          sectionKind: "verified",
        }))}
        selected={selected}
        deletedSelected={{}}
        expanded={expanded}
        allSelected={selectedCount === 6}
        selectedCount={selectedCount}
        trashOpen={false}
        exporting={false}
        updatingTrash={false}
        adminView={false}
        onSelectAll={(checked) =>
          setSelected(Object.fromEntries(people.map((p) => [p.id, checked])))
        }
        onSelectRespondent={(id, checked) =>
          setSelected((old) => ({ ...old, [id]: checked }))
        }
        onSelectDeleted={() => {}}
        onToggleExpanded={(id) =>
          setExpanded((old) => ({ ...old, [id]: !old[id] }))
        }
        onToggleTrash={() => {}}
        onDeleteSelected={() => {}}
        onExport={() => {}}
        onRestore={() => {}}
        renderMethodHelp={(g) => (
          <button
            className="landing-method-help"
            onClick={() => setMethodology(demoMethodologies[g.code])}
          >
            <Info size={14} />
            Как считается
          </button>
        )}
        renderMethodResult={(g) => <MethodScoreSummary group={g} />}
        getRespondentGroups={(p) => p.groups}
        renderRespondentDetails={(p, groupCode) => (
          <RespondentDetails
            respondent={p}
            groupCode={groupCode}
            methodologies={demoMethodologies}
            onShowMethodology={setMethodology}
            renderResult={(g) => <MethodologyInterpretation group={g} />}
          />
        )}
      />
      {methodology && (
        <MethodologyModal
          methodology={methodology}
          onClose={() => setMethodology(null)}
        />
      )}
    </div>
  );
}
