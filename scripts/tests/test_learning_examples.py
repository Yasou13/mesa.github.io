import contextlib
import io
import json
import math
from pathlib import Path
import unittest
from sync_articles import block_to_markdown, parse_markdown_blocks

ROOT=Path(__file__).resolve().parents[2]

class LearningExamples(unittest.TestCase):
    def test_search_lab_executes_and_both_languages_publish_identical_code(self):
        hub=json.loads((ROOT/'content/hub.json').read_text())
        entry=next(e for e in hub['entries'] if e['id']=='build-a-small-search-lab')
        snippets=[[b['code'] for s in entry['locales'][lang]['sections'] for b in s['blocks'] if b['kind']=='code'] for lang in ['en','tr']]
        self.assertEqual(snippets[0],snippets[1])
        output=io.StringIO()
        with contextlib.redirect_stdout(output):exec(compile(snippets[0][0],'search_lab.py','exec'),{})
        self.assertIn('handbook-r3/c1 | Atlas reading room opens at 10:00 on Friday.',output.getvalue())

    def test_worked_arithmetic_and_source_span(self):
        self.assertAlmostEqual(4.4/2.75,1.6)
        self.assertAlmostEqual(4.4/4.1,1.0731707317)
        self.assertAlmostEqual(1/62+1/61,0.032522474881)
        dcg=3/math.log2(3)+1/math.log2(4)
        ideal=3+1/math.log2(3)
        self.assertAlmostEqual(dcg/ideal,0.6590018048)
        self.assertEqual('Atlas opens at 09:00.'[15:20],'09:00')

    def test_answered_exercise_round_trips_through_markdown(self):
        block={'kind':'exercise','title':'Try it','text':'Which source?','answer':'Use the exact revision.'}
        self.assertEqual(parse_markdown_blocks(block_to_markdown(block)),[block])
