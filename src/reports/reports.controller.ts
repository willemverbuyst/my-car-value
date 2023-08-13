import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dto/approve-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { ReportDto } from './dto/report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOkResponse({
    description: 'All reports returned successfully',
    type: Report,
    isArray: true,
  })
  @Get('/')
  async getReports() {
    return this.reportsService.getReports();
  }

  @ApiResponse({
    status: 201,
    description: 'Report is created',
    type: Report,
  })
  @ApiBadRequestResponse({ description: 'Data is malformed' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @ApiOkResponse({
    description: 'The report has been approved and is returned successfully',
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @ApiOkResponse({
    description: 'The estimate is returned successfully',
  })
  @Get('/estimate')
  async getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @ApiOkResponse({
    description: 'The report is returned successfully',
  })
  @ApiNotFoundResponse({ description: 'Repport not found' })
  @Get('/:id')
  async findReport(@Param('id') id: string) {
    const user = await this.reportsService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('report not found');
    }

    return user;
  }
}
