from django.shortcuts import redirect, render
from .models import Submission, SubmissionFile, Vote, Guess, Code

def index(request):
    return render(request, 'index.html')


def get_subs():
    try:
        subs = Submission.objects.filter(visible=True)
        # Attach all files to the submission.
        for sub in subs:
            sub.files = SubmissionFile.objects.filter(submission = sub.id)
        return subs
    except:
        print('Failed to get any submissions...')
        return []


def code_exists(code: str) -> bool:
    try:
        return Code.objects.get(code=code) is not None
    except Code.DoesNotExist:
        return False


def code_valid(code: str) -> bool:
    code = Code.objects.get(code=code)
    if code.used >= code.max:
        return False

    code.used += 1
    code.save()
    return True


def vote(request):
    if request.method == 'POST':

        """
        code = request.POST.get('code')
        if not code_exists(code):
            return render(request, 'error.html',
                {'error':  'Den där koden stämde inte... Dubbelkolla igen eller fråga tomten efter hjälp.'}
            )
        elif not code_valid(code):
            return render(request, 'error.html',
                {'error':  'Den där koden har redan använts tillräckligt! Sluta fuska.'}
            )
        """

        if 'submission' not in request.POST:
            return render(request, 'error.html',
                {'error':  'Du måste rösta på något av bidragen!'}
            )

        voter = request.POST.get('voter')
        if not voter:
            return render(request, 'error.html',
                {'error':  'Du måste skriva under med ditt namn när du röstar.'}
            )

        # Save vote
        vote_id = request.POST['submission']
        Vote.objects.create(submission_id=vote_id, voter=voter).save()

        # Save guesses.
        for key in request.POST:
            if not key.startswith('guess-'):
                continue

            vote_id = key.split('guess-submission-')[1]
            guess = request.POST[key]

            if guess:
                Guess(submission_id=vote_id, theme=guess).save()

        return render(request, 'success.html')

    else:
        # Get request
        return render(request, 'vote.html', {
            'submissions': get_subs()
        })


def submission(request):
    return render(request, 'submission.html', {
        'submissions': get_subs()
    })