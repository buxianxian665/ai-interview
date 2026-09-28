// Entirely fictional, fixed demonstration. No model requests or user scoring.
const interviewDemo = (() => {
  const rows = [
    ['用户研究', '访谈 5 名同学，整理学习工具使用障碍', 'medium', '有访谈经历，但尚未说明建议的验证方法', '你如何把访谈中发现的问题转化为产品优化建议？', '我访谈了同学，发现工具不好用，建议简化操作，让用户更容易完成任务。', '你依据哪条观察决定简化操作？如何验证这个建议？', '在这个虚构案例中，3 名同学提到找不到资料导入入口。我提出把入口放到首页，尚未上线。计划让同学完成同一导入任务，记录成功率、耗时和求助次数，再决定是否保留。', '初次回答只有结论，没有观察依据或验证方法。', '补充了问题频率、具体改动与验证指标，但样本较小且未验证。', 3.5],
    ['产品流程设计', '输出需求清单和原型草稿，未开发上线', 'medium', '有方案产出，尚缺异常路径与验收标准', '为资料导入功能设计最小可用流程，你会考虑哪些异常？', '选择文件、上传、查看结果，失败时提示重试。', '如果反复重试仍然失败，用户应该如何继续？', '先检查格式和大小，上传时展示进度。解析失败时保留原文件选择，说明失败原因并提供粘贴文本入口。上线前验证取消、超时和重复提交，不把重试作为唯一出口。', '只描述正常流程，重试无法解决所有失败。', '补充了可恢复路径，仍需要实际可用性测试。', 3.5],
    ['AI 质量评估', '设计文案生成评测方案，未组织正式评测', 'weak', '缺少固定测试集与评分一致性验证', '你会如何判断生成文案是否满足用户需求？', '看用户修改次数，修改越少说明文案越好。', '用户直接放弃也可能没有修改，怎样避免误判？', '把采用、放弃和修改分开记录。用固定样本人工评估事实对应、需求符合和表达清楚三个维度，并为低中高分写示例。先让评审独立打分，再讨论分歧，测试集不参与提示词调整。', '单一修改次数无法区分满意和放弃。', '识别了指标歧义并提出校准方法，尚无执行结果。', 3.0],
    ['竞品与需求判断', '分析 10 款工具，整理 20 条功能记录', 'medium', '功能对比不等于理解用户需求', '如何避免竞品研究只是罗列功能？', '我会把竞品的功能做成表格，参考优秀产品增加功能。', '如何判断某个功能适合你的目标用户？', '先固定同一个用户任务，例如整理课堂笔记，再比较完成步骤、失败点和替代方法。结合访谈判断问题频率与影响，优先解决核心任务卡点；不因为竞品有某个功能就照搬。', '没有把竞品功能映射到具体用户任务。', '能围绕任务解释取舍，但缺少实际对照记录。', 3.5],
    ['迭代优先级', '尚无上线数据或跨团队交付证据', 'missing', '缺少真实交付与效果证据', '只有两周时间，你会优先优化什么，并如何判断有效？', '我会优化界面和生成质量，让用户满意。', '请选一个具体问题，给出范围和验收方式。', '若测试发现错误事实影响使用，我会优先增加生成前的信息确认。本轮不做语音和登录。明确设计的确认入口、研发的纠错记录、模型的事实约束，并使用固定案例检查错误事实进入最终文案的比例。这只是计划，尚未执行。', '范围和验收标准过于笼统。', '能限定范围并分配任务，但交付能力仍待实践证明。', 3.0]
  ];
  const analysis = {
    target_role: 'AI 产品经理实习生（虚构案例）',
    competencies: rows.map((r,i)=>({competency_id:`c${i}`,name:r[0]})),
    resume_evidence: rows.slice(0,4).map((r,i)=>({evidence_id:`e${i}`,claim:r[1]})),
    matches: rows.map((r,i)=>({competency_id:`c${i}`,evidence_ids:i<4?[`e${i}`]:[],match_level:r[2],interview_risk:i===4||i===2?'high':'medium',reason:r[3],gaps:[r[3]]}))
  };
  const questions = rows.map((r,i)=>({questionId:`demo${i+1}`,type:'预设案例演示',competency:r[0],source:r[1],prompt:r[4],sample:r[5],followup:r[6],followupSample:r[7],gap:r[8],expected:['具体事实','决策依据','验证方法'],score:r[10]}));
  const diagnoses = rows.map(r=>({scores:[{score:r[10]}],strongest_evidence:[r[9]],main_gap:r[3],credibility:{reason:'此为虚构案例；计划、原型与上线成果不能混为一谈。'},review:{diagnosis:r[9],actions:['保留具体事实及其来源','补充可检验的验收标准','明确尚未执行的部分'],optional_structure:['观察','决策','验证计划','证据边界']}}));
  const report = {
    overall_score:3.3,
    quick_report:{summary:'示例报告：能提出产品方案，真实验证与交付证据仍需补充。',dimension_scores:[{dimension:'需求理解',score:3.5},{dimension:'产品思维',score:3.5},{dimension:'数据意识',score:3},{dimension:'AI 质量意识',score:3},{dimension:'表达清晰度',score:3.5},{dimension:'证据边界',score:3.5}],strongest_evidence:['从访谈观察推导具体改动','能区分事实、推断与计划','能为失败场景提供替代路径'],main_gaps:['样本较小，未验证代表性','没有上线和实际评测结果','缺少跨团队交付证据'],next_action:'用一次小规模任务测试，验证资料导入入口是否更容易被发现。'},
    deep_report:{core_diagnosis:'本案例展示如何把笼统的建议追问为具体依据。补充回答让方案更清楚，但不会把验证计划变成已经取得的成果。',question_reviews:rows.map((r,i)=>({question_id:`demo${i+1}`,score:r[10],main_judgment:r[9],evidence_quotes:[r[7]],next_actions:[r[3]]})),evidence_audit:{confirmed:['仅指虚构案例内陈述：完成访谈、竞品记录与原型草稿'],inferences:['候选人可能具备基础需求分析能力，仍需更多证据'],unknowns:['建议实际采用情况','真实用户体验改善程度','上线后的运营表现']},training_plan:[{priority:1,task:'验证一个核心任务',deliverable:'任务测试记录',completion_criteria:'记录任务结果、卡点及原话，不预设提升幅度'},{priority:2,task:'完善评分示例',deliverable:'评分规则与固定样本',completion_criteria:'明确各分值标准并检查评审分歧'},{priority:3,task:'整理迭代复盘',deliverable:'一次改动前后对照',completion_criteria:'说明改了什么、证据是什么、仍有什么未知'}]},
    disclaimer:'演示报告：基于五组虚构问答预设，不代表访客能力，不是实时 AI 评分，也不是录用判断。'
  };
  return {analysis,questions,diagnoses,report};
})();
