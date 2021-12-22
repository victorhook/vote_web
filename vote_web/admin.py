from django.contrib import admin
from .models import SubmissionFile, Submission, Vote, Code, Guess

admin.site.register(SubmissionFile)
admin.site.register(Submission)
admin.site.register(Vote)
admin.site.register(Code)
admin.site.register(Guess)
