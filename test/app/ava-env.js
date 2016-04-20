import test from 'ava'
import ButtonDefault from 'components/Buttons/ButtonDefault'

test('Component should be loaded under ava environment successfully.', t => {
  t.truthy(ButtonDefault)
})
