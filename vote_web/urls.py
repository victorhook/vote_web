from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('vote/', views.vote, name='vote'),
    path('submission/', views.submission, name='submission'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
